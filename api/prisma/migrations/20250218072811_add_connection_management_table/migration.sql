-- CreateTable
CREATE TABLE "ConnectionState" (
    "id" SERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionState_vehicleId_key" ON "ConnectionState"("vehicleId");
