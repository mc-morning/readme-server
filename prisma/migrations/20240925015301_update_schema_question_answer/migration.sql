/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,questionnaireId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Question_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_questionnaireId_key" ON "Question"("id", "questionnaireId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_questionnaireId_fkey" FOREIGN KEY ("questionId", "questionnaireId") REFERENCES "Question"("id", "questionnaireId") ON DELETE RESTRICT ON UPDATE CASCADE;
