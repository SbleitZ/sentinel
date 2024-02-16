const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser(body){
    if(!body) return;
    await prisma.user.create({
        data:body,
    });
}

module.exports = {
    createUser:async function createUser(body){
        if(!body) return;
        try {
            await prisma.user.create({
                data:body,
            });
            return ""
        } catch (e) {
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                if(e.code == "P2002") return "El usuario ya existe, el error esta en " + e.meta.target
            }
            return "Ha ocurrido un error desconocido"
        }
    }
};