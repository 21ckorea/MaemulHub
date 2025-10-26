-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'in_progress', 'closed');

-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('web', 'phone', 'referral', 'kakao');

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" "InquirySource" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "assignee" TEXT,
    "notes" TEXT,
    "customerId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_source_idx" ON "Inquiry"("source");

-- CreateIndex
CREATE INDEX "Inquiry_customerId_idx" ON "Inquiry"("customerId");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
