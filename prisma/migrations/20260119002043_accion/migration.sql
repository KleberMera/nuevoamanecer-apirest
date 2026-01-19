-- CreateTable
CREATE TABLE "Accion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
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
