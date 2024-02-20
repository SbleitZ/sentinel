import { SlashCommandBuilder } from "discord.js";
const timezones = require('../../utils/timezones');
import {setConfig} from "../../controllers/config.controller";
module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Actualiza la configuración del bot!')
        .addStringOption((option) => option.setName('zona_horaria').setDescription('Zona horaria con la que se calculara los tiempos.')
        .addChoices(
            ...timezones.data.map(({city,locale,timeZone}:any) => {
                return {name:city,value:locale+","+timeZone}
            })
            )
            .setRequired(true))
        .addStringOption((option) => option.setName("hora_de_entrada").setDescription("Hora de entrada | Formato `Hora:Minutos` Ejemplo: 8:30").setRequired(true).setMinLength(3).setMaxLength(5))
        .addStringOption((option) => option.setName("hora_de_salida").setDescription("Hora de salida | Formato `Hora:Minutos Ejemplo: 18:30`").setRequired(true).setMinLength(3).setMaxLength(5)),
        category:"Config",
	async execute(interaction:any) {
        if(!interaction.member) return await interaction.reply({content:"Este comando solo puede ser usado en el servidor.",ephemeral:true});
        const regex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/;
        const entryTime = interaction.options.getString('hora_de_entrada');
        const exitTime = interaction.options.getString('hora_de_salida');
        if(!regex.test(entryTime) && !regex.test(exitTime)) return await interaction.reply({content:"Por favor introduce una hora correcta.",ephemeral:true});
        
        const timeZone = interaction.options.getString('zona_horaria');
        // 0 locale | 1 timezone
        const values = timezones.data.filter((tz:any) => timeZone?.split(",")[1] == tz.timeZone)[0]
        await setConfig({
            timeZone:values.timeZone,
            city:values.city,
            locale:values.locale,
            serverName:interaction?.member?.guild?.name,
            serverId:interaction?.member.guild.id,
            serverAvatar:interaction.member.guild.iconURL(),
            exitTime,
            entryTime,
        })
        const city = values.city || "";
        await interaction.reply("La zona horaria se actualizo a " + city)
	}, 
};
