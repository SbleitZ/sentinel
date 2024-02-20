
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
        return "Ha ocurrido un error desconocido"
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