
import { getUTC } from "../utils/timezones";
import { IUser } from "../types/user";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
export async function createUser(body:IUser){
    if(!body) return "";
    try {
        await prisma.user.create({
            data:body,
        });
        return ""
    } catch (e:any) {
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code == "P2002") return "El usuario ya existe, el error esta en " + e?.meta?.target
        }
        return "Ha ocurrido un error desconocido"
    }
}

export async function getUser(userId:string | undefined,dates: boolean = false){
    try{
        return await prisma.user.findUnique({
            where:{
                discordUserId:userId,
            },
            include:{
                dates:dates,
            }
            
        })
    }catch(e:any){
        console.log(e);
        return null
    }
}

export async function removeUserAndDates(userId:string | undefined){
    if(!userId) return "";
    try {
        const deletedUser = await prisma.user.delete({
            where:{
                discordUserId: userId,
            }
        })
        return ""
    } catch (e:any) {
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code == "P2002") return "El usuario no existe, el error esta en " + e?.meta?.target
        }
        return "Ha ocurrido un error desconocido"
    }

}
export async function getUsers(){
    const users = await prisma.user.findMany();
    if(users.length == 0) return null;
    return users;
}


export async function restartUsersChecks(){
    /*
        Busca a las personas que estan trabajando y convierte eso en false
        Se les dejara como null el checkOut, y así la revisión será si existe algun checkOut como null, contara como que no cerro asistencia.
    */
    try {
        const UTC = await getUTC();
        const usersUpdated = await prisma.user.updateMany({
            where:{
                working:true,
            },
            data:{
                working:false,
            },
        });
        const datesUpdated = await prisma.date.updateMany({
            where:{
                checkIn:{startsWith:UTC.split(",")[0]},
                checkOut:null
            },
            data:{
                isRestarted:true,
            }
        });
        return "Usuarios actualizados " + usersUpdated.count + " salidas actualizadas + " + datesUpdated.count;
    } catch (error) {
        return "Ha ocurrido un error al restaurar a los usuarios.";
    }
}