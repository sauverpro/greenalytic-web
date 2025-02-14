/*
  Warnings:

  - You are about to drop the column `deliveringLocation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "deliveringLocation",
DROP COLUMN "picture";
