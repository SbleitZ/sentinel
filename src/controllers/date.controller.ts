
import { PrismaClient } from "@prisma/client";
import { getUTC } from "../utils/timezones";
import { STATUS } from "../utils/status";

interface ICheck{
    userId:string | undefined;
    serverId:string | undefined;
}
const prisma = new PrismaClient();
export async function checkInUser(data:ICheck){
    const checkInDate = await getUTC();
    const user = await prisma.user.findUnique({
        where:{discordUserId:data.userId}
    });
    if(!user) return STATUS.USER_DONT_EXISTS;
    if(!user?.working){//no esta trabajando,
        await prisma.date.create({
            data:{
                checkIn: checkInDate.toISOString(),
                user:{
                    connect:{discordUserId:data.userId}
                }
        
            }
        })
        await prisma.user.update({
            where:{discordUserId:data.userId},
            data:{
                working:true,
            }
        })
        return STATUS.ASSISTANCE_SUCCESS;
    }else{//esta trabajando y quiere marcar de nuevo su asistencia
        return STATUS.ERORR_WORKING;
    }
}
export async function checkOutUser(data:ICheck){
    const checkOutDate = await getUTC();
    const user = await prisma.user.findUnique({
        where:{discordUserId:data.userId}
    });
    if(!user) return STATUS.USER_DONT_EXISTS;
    if(!user.working){// no esta en estado de trabajo, así que no puiede marcar que salio si no ha entrado
        return STATUS.ERROR_NOT_WORKING;
    }
    if(user?.working){//esta trabajando,
        await prisma.date.create({
            data:{
                checkIn: checkOutDate.toISOString(),
                user:{
                    connect:{discordUserId:data.userId}
                }
        
            }
        })
        await prisma.user.update({
            where:{discordUserId:data.userId},
            data:{
                working:false,
            }
        })
        return STATUS.CHECKOUT_SUCCESS;
    }
}

//para terminar el date