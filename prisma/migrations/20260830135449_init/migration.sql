-- CreateEnum
CREATE TYPE "PrivacyRequestType" AS ENUM ('ACCESS', 'CORRECTION', 'DELETION', 'PORTABILITY');

-- CreateEnum
CREATE TYPE "PrivacyRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "reminderSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "IndexRateCache" (
    "id" TEXT NOT NULL,
    "index" "AdjustmentIndex" NOT NULL,
    "referenceDate" DATE NOT NULL,
    "accumulatedPercent" DECIMAL(7,4) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndexRateCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PrivacyRequestType" NOT NULL,
    "details" TEXT,
    "status" "PrivacyRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "propertyCount" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'landing_hero',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndexRateCache_index_referenceDate_key" ON "IndexRateCache"("index", "referenceDate");

-- CreateIndex
CREATE INDEX "PrivacyRequest_userId_idx" ON "PrivacyRequest"("userId");

-- CreateIndex
CREATE INDEX "PrivacyRequest_status_idx" ON "PrivacyRequest"("status");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- AddForeignKey
ALTER TABLE "PrivacyRequest" ADD CONSTRAINT "PrivacyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
