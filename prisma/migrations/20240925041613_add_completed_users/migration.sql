/*
  Warnings:

  - You are about to drop the column `completedCount` on the `Questionnaire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questionnaire" DROP COLUMN "completedCount",
ADD COLUMN     "completedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[];
