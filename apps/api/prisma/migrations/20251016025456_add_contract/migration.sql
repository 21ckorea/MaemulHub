-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('lease', 'rent', 'sale');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('draft', 'signed', 'cancelled');

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "type" "ContractType" NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'draft',
    "propertyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "price" INTEGER,
    "deposit" INTEGER,
    "rent" INTEGER,
    "signedAt" TIMESTAMP(3),
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "assignee" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contract_propertyId_idx" ON "Contract"("propertyId");

-- CreateIndex
CREATE INDEX "Contract_customerId_idx" ON "Contract"("customerId");

-- CreateIndex
CREATE INDEX "Contract_type_idx" ON "Contract"("type");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
