
import { PrismaClient } from "@prisma/client";
import { getUTC } from "../utils/timezones";
import { STATUS } from "../utils/status";
import { STATUS_CODES } from "http";
import { msPerDay, msPerHour, msPerMinute } from "../utils/ms";
import getISOString from "../utils/ISOString";

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
    const date = await prisma.date.findMany({
        where: {
            checkIn: {startsWith: checkInDate.split(",")[0]},
        }
    })
    if(date?.length !== 0) return STATUS.REPEAT_DAY;
    if(!user) return STATUS.USER_DONT_EXISTS;
    // h.toLocaleDateString()+"T"+h.toLocaleTimeString()
    if(!user?.working){//no esta trabajando,
        await prisma.date.create({
            data:{
                checkIn: checkInDate,
                user:{
                    connect: {
                        discordUserId:data.userId,
                    }
                }
                
            },
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
    const date = await prisma.date.findMany({
        where: {
            checkIn: {startsWith: checkOutDate.split(",")[0]},
        }
    })
    // se comprueba si existe alguna entrada del mismo dia en el que se registra la salida
    // y el date.length == 0 comprueba lo mismo de arriba, ya que si no encuentra nada, entrega un array []
    if(!date || date.length == 0) return STATUS.ERROR_DAY;
    if(user?.working){//esta trabajando,
        await prisma.date.updateMany({
            where:{checkIn:{startsWith:checkOutDate.split(",")[0]}},
            data:{
                checkOut:checkOutDate,
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
export async function getTime(userId:string | undefined){
    try {
        const UTC = await getUTC();
        const date = await prisma.date.findFirst(
            {
                where:{checkIn:{startsWith:UTC.split(",")[0]}}
            }
        );
        const o = new Date(date?.checkIn as string)
        const w= new Date(UTC)
        const h = Math.abs(o.getTime()-w.getTime())
        console.log("Tiempo: " + h)
        console.log("Este es o: "+o)
        console.log("Este es UTC: "+w)
        const hours = Math.floor(h/msPerHour);
        //(diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)
        const minutes = Math.floor((h%(msPerHour))/(1000 * 60));
        return hours + " horas, " + minutes + " minutos."
    } catch (error) {
        return "Ha ocurrido un error."
    }
}


//para terminar el date