import { IConfig } from "../types/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function setConfig(body:IConfig){
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

export async function test(userId:string | undefined){
    return await prisma.user.findMany({
        where:{discordUserId:userId},
        include:{
            attendance:true,
        }
    });
}