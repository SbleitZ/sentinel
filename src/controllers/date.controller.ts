
import { PrismaClient } from "@prisma/client";
import { getUTC } from "../utils/timezones";
import { STATUS } from "../utils/status";
import { msPerHour } from "../utils/ms";

interface ICheck{
    userId:string | undefined;
    serverId:string | undefined;
}
const prisma = new PrismaClient();
export async function checkInUser(data:ICheck){
    const checkInDate = await getUTC();
    if(!checkInDate) return STATUS.ERROR_CONFIG;
    const user = await prisma.user.findUnique({
        where:{discordUserId:data.userId}
    });
    const date = await getOneDate({
        UTC:checkInDate,
        userId:data.userId,
    })
    if(date) return STATUS.REPEAT_DAY;
    if(!user) return STATUS.USER_DONT_EXISTS;
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
            where:{
                discordUserId:data.userId
            },
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
    if(!checkOutDate) return STATUS.ERROR_CONFIG;
    const user = await prisma.user.findUnique({
        where:{discordUserId:data.userId}
    });
    // validación para comprobar si el usuario existe
    if(!user) return STATUS.USER_DONT_EXISTS;
    if(!user.working){// no esta en estado de trabajo, así que no puiede marcar que salio si no ha entrado
        return STATUS.ERROR_NOT_WORKING;
    }
    const date = await getOneDate({
        UTC:checkOutDate,
        userId:data.userId
    });

    // Añadir una variable a cada usuario que sea un flag de si tiene permitido hacer horas extras, en caso de que no, no se le 
    // autoriza marcar la salida 1 hora después, ya que a esa hora es el reinicio
    // se comprueba si existe alguna entrada del mismo dia en el que se registra la salida
    // y el date.length == 0 comprueba lo mismo de arriba, ya que si no encuentra nada, entrega un array []
    const difference = getTimeDiff(new Date(checkOutDate),new Date(date?.checkIn as string));
    if(difference.hours > 10) return STATUS.ERROR_HOURS
    if(!date) return STATUS.ERROR_DAY;
    if(user?.working){//esta trabajando,
        await prisma.date.updateMany({
            where:{
                checkIn:{
                    startsWith:checkOutDate.split(",")[0]
                },
                user:{
                    discordUserId:data.userId
                }
            },
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
        const nowDate = await getOneDate({
            UTC,
            userId
        });
        const checkInDate = new Date(nowDate?.checkIn as string);
        const checkOutDate= new Date(UTC);
        const differenceDates = Math.abs(checkInDate.getTime()-checkOutDate.getTime());

        const {hours,minutes,seconds} = getTimeDiff(checkInDate,checkOutDate);
        return hours + " horas, " + minutes + " minutos, " + seconds + " segundos.";
    } catch (error) {
        return "Ha ocurrido un error."
    }
}
function getTimeDiff(date1:Date,date2:Date){
    const differenceDates = Math.abs(date1.getTime()-date2.getTime());
    return {
        hours:Math.floor(differenceDates/msPerHour),
        minutes:Math.floor((differenceDates%(msPerHour))/(1000 * 60)),
        seconds:Math.floor((differenceDates/1000)%60)
    }
}
async function getOneDate(options:{UTC:string,userId:string | undefined}){
    const {UTC,userId} = options;
    return await prisma.date.findFirst({
        where:{
            checkIn:{
                startsWith:UTC.split(",")[0]
            },
            user:{
                discordUserId:userId
            },
        }
    });        
        
}
//para terminar el date