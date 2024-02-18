-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "serverName" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "serverAvatar" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordUserName" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "working" BOOLEAN DEFAULT false,
    "discordUserAvatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Date" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_serverId_key" ON "Config"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUserId_key" ON "User"("discordUserId");

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
