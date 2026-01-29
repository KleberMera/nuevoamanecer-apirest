-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "numSolicitud" INTEGER,
    "periodo" TEXT,
    "monto" INTEGER NOT NULL,
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

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePrestamo" ADD CONSTRAINT "DetallePrestamo_prestamoId_fkey" FOREIGN KEY ("prestamoId") REFERENCES "Prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
