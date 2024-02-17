const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    setConfig:async function createConfig(body){
        if(!body) return;
        const { timeZone, city, locale,serverId,serverName,serverAvatar} = body;
        const config = await prisma.config.upsert({
            where:{serverId},
            update:{timeZone,city,locale},
            create:{
                timeZone,
                city,
                locale,
                serverId,
                serverName,
                serverAvatar
            }
        })
    }

};