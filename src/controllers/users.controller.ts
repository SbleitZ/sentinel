import { IUser } from "../types/user";

const { PrismaClient, Prisma } = require("@prisma/client");

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
            if(e.code == "P2002") return "El usuario ya existe, el error esta en " + e.meta.target
        }
        return "Ha ocurrido un error desconocido"
    }
}
