import { IConfig } from "../types/config";

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function setConfig(body:IConfig){
    if(!body) return;
    const { timeZone, city, locale,serverId,serverName,serverAvatar,entryTime,exitTime} = body;
    const config = await prisma.config.upsert({
        where:{serverId},
        update:{timeZone,city,locale},
        create:{
            timeZone,
            city,
            locale,
            serverId,
            serverName,
            serverAvatar,
            entryTime,
            exitTime
        }
    })
}

export async function getConfig(
){
    try {
        
        const config = await prisma.config.findUnique({
            where:{
                serverId:process.env.SERVER_ID
            },
        });
        return config;
  
    } catch (error) {
        console.log(error?.code);
        console.log("Error en la función config");
    }
}