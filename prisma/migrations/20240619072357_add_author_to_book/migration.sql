/*
  Warnings:

  - Added the required column `author` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "author" TEXT NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;
