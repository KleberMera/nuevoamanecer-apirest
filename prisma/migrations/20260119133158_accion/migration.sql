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

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
