const { PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export const data = [
  {
    city: "🇲🇽 Ciudad de Mexico",
    locale: "en-MX",
    timeZone: "America/Mexico_City",
  },
  {
    city: "🇦🇷 Buenos Aires",
    locale: "en-AR",
    timeZone: "America/Argentina/Buenos_Aires",
  },
  {
    city: "🇵🇪 Lima",
    locale: "en-PE",
    timeZone: "America/Lima",
  },
  {
    city: "🇨🇱 Santiago",
    locale: "en-CL",
    timeZone: "America/Santiago",
  },
  {
    city: "🇺🇾 Montevideo",
    locale: "en-UY",
    timeZone: "America/Montevideo",
  },
  {
    city: "🇵🇾 Asunción",
    locale: "en-PY",
    timeZone: "America/Asuncion",
  },
];
export async function getUTC(){
    const UTC = await prisma.config.findFirst({
        where:{serverId:process.env.SERVER_ID}
    });
    const date = new Date();
    const checkInDate = date.toLocaleString(UTC?.locale, {timeZone: UTC?.timeZone})
    console.log("getUTC " + checkInDate)
    return checkInDate;
}
// https://emojicopy.com/