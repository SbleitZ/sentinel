const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    checkInUser:async function (UTC){
        await prisma.date.create({
            checkIn: new Date(UTC).toISOString(),
            user:{
                connect:{userId:UTC}
            }
        })
    },
    checkOutUser: async function(){
        await prisma.date.create({
            checkOut: new Date(UTC).toISOString(),
            user:{
                connect:{userId:UTC}
            }
        })
    }
};