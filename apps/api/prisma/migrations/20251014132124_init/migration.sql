-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('apartment', 'officetel', 'store', 'land', 'multifamily', 'villa');

-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('sale', 'jeonse', 'monthly', 'lease', 'rent');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('draft', 'review', 'published', 'in_contract', 'closed');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "address" TEXT NOT NULL,
    "complex_name" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "area_supply" DOUBLE PRECISION,
    "area_exclusive" DOUBLE PRECISION,
    "floor" INTEGER,
    "rooms" INTEGER,
    "baths" INTEGER,
    "built_year" INTEGER,
    "parking" TEXT,
    "deal_type" "DealType",
    "price" INTEGER,
    "deposit" INTEGER,
    "rent" INTEGER,
    "available_from" TIMESTAMP(3),
    "maintenance_fee" INTEGER,
    "status" "PropertyStatus" NOT NULL DEFAULT 'draft',
    "assignee" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_deal_type_idx" ON "Property"("deal_type");

-- CreateIndex
CREATE INDEX "Property_type_idx" ON "Property"("type");

-- CreateIndex
CREATE INDEX "Property_lat_lng_idx" ON "Property"("lat", "lng");
