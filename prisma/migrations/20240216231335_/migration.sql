-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "serverName" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
