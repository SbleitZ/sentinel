const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

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
    },
    deleteUser: async function(body){
        console.log("No listo.");
    }
};