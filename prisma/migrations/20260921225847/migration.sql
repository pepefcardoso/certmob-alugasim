-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationNudgeSentAt" TIMESTAMP(3);
