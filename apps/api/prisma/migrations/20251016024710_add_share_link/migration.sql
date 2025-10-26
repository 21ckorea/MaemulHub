-- CreateTable
CREATE TABLE "ShareLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_token_key" ON "ShareLink"("token");

-- CreateIndex
CREATE INDEX "ShareLink_propertyId_idx" ON "ShareLink"("propertyId");

-- CreateIndex
CREATE INDEX "ShareLink_expiresAt_idx" ON "ShareLink"("expiresAt");

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
