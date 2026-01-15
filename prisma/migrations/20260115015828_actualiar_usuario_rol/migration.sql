/*
  Warnings:

  - You are about to drop the column `nombre` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `apellido1` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre1` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "nombre",
ADD COLUMN     "apellido1" TEXT NOT NULL,
ADD COLUMN     "apellido2" TEXT,
ADD COLUMN     "nombre1" TEXT NOT NULL,
ADD COLUMN     "nombre2" TEXT,
ADD COLUMN     "telefono" TEXT NOT NULL;

-- DropTable
DROP TABLE "Roles";

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
