-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre1" TEXT NOT NULL,
    "nombre2" TEXT,
    "apellido1" TEXT NOT NULL,
    "apellido2" TEXT,
    "telefono" VARCHAR(10) NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "email" TEXT,
    "cedula" VARCHAR(10) NOT NULL,
    "password" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "estado" TEXT DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "acumulado" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Accion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "numSolicitud" INTEGER,
    "periodo" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "interes" DOUBLE PRECISION NOT NULL,
    "cuotas" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "frecuencia" TEXT NOT NULL DEFAULT 'MENSUAL',
    "estado" TEXT DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePrestamo" (
    "id" SERIAL NOT NULL,
    "prestamoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3),
    "cuotaNum" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "interes" DOUBLE PRECISION NOT NULL,
    "capital" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "periodoPago" TEXT,
    "estadoPago" TEXT DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DetallePrestamo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePrestamo" ADD CONSTRAINT "DetallePrestamo_prestamoId_fkey" FOREIGN KEY ("prestamoId") REFERENCES "Prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- CreateTrigger para calcular acumulado automaticamente
CREATE OR REPLACE FUNCTION calcular_acumulado_accion()
RETURNS TRIGGER AS $$
BEGIN
  -- Obtener el acumulado anterior para este usuario (el valor acumulado más alto)
  SELECT COALESCE(MAX(acumulado), 0) INTO NEW.acumulado
  FROM "Accion"
  WHERE "usuarioId" = NEW."usuarioId";
  
  -- Sumar el valor actual al acumulado anterior
  NEW.acumulado := NEW.acumulado + NEW.valor;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta ANTES de insertar
CREATE TRIGGER trigger_acumulado_accion
BEFORE INSERT ON "Accion"
FOR EACH ROW
EXECUTE FUNCTION calcular_acumulado_accion();

-- CreateView VM_DISTRIBUCION_PERIODOS
DROP VIEW IF EXISTS "VmDistribucionPeriodos" CASCADE;

CREATE VIEW "VmDistribucionPeriodos" AS
SELECT
    dp."periodoPago" AS periodo,
    CASE EXTRACT(MONTH FROM TO_DATE(dp."periodoPago" || '01', 'YYYYMMDD'))
        WHEN 1 THEN 'ENERO'
        WHEN 2 THEN 'FEBRERO'
        WHEN 3 THEN 'MARZO'
        WHEN 4 THEN 'ABRIL'
        WHEN 5 THEN 'MAYO'
        WHEN 6 THEN 'JUNIO'
        WHEN 7 THEN 'JULIO'
        WHEN 8 THEN 'AGOSTO'
        WHEN 9 THEN 'SEPTIEMBRE'
        WHEN 10 THEN 'OCTUBRE'
        WHEN 11 THEN 'NOVIEMBRE'
        WHEN 12 THEN 'DICIEMBRE'
    END AS mes,
    
    COALESCE(SUM(dp."monto"), 0) AS totalCobrado,
    COALESCE(SUM(dp."interes"), 0) AS totalInteres,
    COALESCE(SUM(dp."capital"), 0) AS totalCapital,
    
    COALESCE(SUM(dp."interes") * 0.20, 0) AS interesPorciento,
    
    COALESCE(SUM(dp."interes") - (SUM(dp."interes") * 0.20), 0) AS interesMenosPorciento,
    
    COALESCE(SUM(a."numero"), 0) AS totalAcciones,
    
    CASE 
        WHEN COALESCE(SUM(a."numero"), 0) > 0
        THEN (
            COALESCE(SUM(dp."interes"), 0) - (COALESCE(SUM(dp."interes"), 0) * 0.20)
        ) / COALESCE(SUM(a."numero"), 1)::FLOAT
        ELSE 0
    END AS utilidadPorAccion

FROM "DetallePrestamo" dp
LEFT JOIN "Accion" a ON a."periodo" = dp."periodoPago" AND a."estado" = 'A'
WHERE dp."estadoPago" = 'PAGADO'
  AND dp."periodoPago" IS NOT NULL
GROUP BY dp."periodoPago"
ORDER BY periodo DESC;

-- CreateView VmNominaPayosCabecera
DROP VIEW IF EXISTS "VmNominaPagosCabecera" CASCADE;

CREATE VIEW "VmNominaPagosCabecera" AS
SELECT
    dp."periodoPago" AS periodo,
    CASE EXTRACT(MONTH FROM TO_DATE(dp."periodoPago" || '01', 'YYYYMMDD'))
        WHEN 1 THEN 'ENERO'
        WHEN 2 THEN 'FEBRERO'
        WHEN 3 THEN 'MARZO'
        WHEN 4 THEN 'ABRIL'
        WHEN 5 THEN 'MAYO'
        WHEN 6 THEN 'JUNIO'
        WHEN 7 THEN 'JULIO'
        WHEN 8 THEN 'AGOSTO'
        WHEN 9 THEN 'SEPTIEMBRE'
        WHEN 10 THEN 'OCTUBRE'
        WHEN 11 THEN 'NOVIEMBRE'
        WHEN 12 THEN 'DICIEMBRE'
    END AS mes,
    COALESCE(SUM(dp."monto"), 0) AS totalCuota,
    COALESCE(SUM(dp."capital"), 0) AS totalCapital,
    COALESCE(SUM(dp."interes"), 0) AS totalInteres,
    COUNT(DISTINCT p."usuarioId") AS cantidadUsuarios

FROM "DetallePrestamo" dp
JOIN "Prestamo" p ON dp."prestamoId" = p.id
WHERE dp."periodoPago" IS NOT NULL
GROUP BY dp."periodoPago"
ORDER BY periodo DESC;

-- CreateView VmNominaPayosDetalle
DROP VIEW IF EXISTS "VmNominaPagosDetalle" CASCADE;

CREATE VIEW "VmNominaPagosDetalle" AS
SELECT
    dp."periodoPago" AS periodo,
    CASE EXTRACT(MONTH FROM TO_DATE(dp."periodoPago" || '01', 'YYYYMMDD'))
        WHEN 1 THEN 'ENERO'
        WHEN 2 THEN 'FEBRERO'
        WHEN 3 THEN 'MARZO'
        WHEN 4 THEN 'ABRIL'
        WHEN 5 THEN 'MAYO'
        WHEN 6 THEN 'JUNIO'
        WHEN 7 THEN 'JULIO'
        WHEN 8 THEN 'AGOSTO'
        WHEN 9 THEN 'SEPTIEMBRE'
        WHEN 10 THEN 'OCTUBRE'
        WHEN 11 THEN 'NOVIEMBRE'
        WHEN 12 THEN 'DICIEMBRE'
    END AS mes,
    CONCAT(u."nombre1", ' ', COALESCE(u."nombre2", ''), ' ', u."apellido1", ' ', COALESCE(u."apellido2", '')) AS nombreCompleto,
    dp."monto" AS cuota,
    dp."capital" AS capital,
    dp."interes" AS interes,
    dp."estadoPago" AS estadoPago,
    CONCAT(dp."cuotaNum"::VARCHAR, '/', p."cuotas"::VARCHAR) AS cuotaPagar
FROM "DetallePrestamo" dp
JOIN "Prestamo" p ON dp."prestamoId" = p.id
JOIN "Usuario" u ON p."usuarioId" = u.id
WHERE dp."periodoPago" IS NOT NULL
ORDER BY dp."periodoPago" DESC, dp."cuotaNum" ASC;
