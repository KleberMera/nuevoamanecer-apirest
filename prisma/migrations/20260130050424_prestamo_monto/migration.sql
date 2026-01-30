/*
  Warnings:

  - Added the required column `monto` to the `DetallePrestamo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetallePrestamo" ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Prestamo" ALTER COLUMN "monto" SET DATA TYPE DOUBLE PRECISION;
