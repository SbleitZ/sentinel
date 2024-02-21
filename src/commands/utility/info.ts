
import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { getConfig } from "../../controllers/config.controller";
module.exports = {

	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Obtener información acerca del bot.!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	permissions:["Administrator"],
	async execute(interaction:CommandInteraction){
        if(!interaction.member) return await interaction.reply("Este comando solo puede ser usado dentro del servidor")
		const serverConfig = await getConfig();
        if(!serverConfig) return await interaction.reply("No existe ninguna configuración para el servidor, por favor usa /config");
        const embedConfig = new EmbedBuilder()
            .addFields(
                {name:'Nombre del servidor',value:serverConfig?.serverName || "",inline:false},
                {name:'ID del servidor',value:serverConfig?.serverId || "",inline:false},
                {name:'Ciudad',value:serverConfig?.city || "",inline:true},
                {name:'Lugar',value:serverConfig?.locale || "",inline:true},
                {name:'Zona horaria',value:serverConfig?.timeZone || "",inline:true},
                )
            .setThumbnail(serverConfig?.serverAvatar as string)
            .setFooter({
                iconURL: interaction.client.user.avatarURL() || "",
                text: process.env.NAME_SERVER + " | Información",
              });
        
		await interaction.reply({embeds:[embedConfig]});
	},

}

/*
	cada dia dos horas después de la hora de salida marcada
	recorrer todos los usuarios para que en caso de que no tengan un date
	de ese mismo dia, marcarles la inasistencia y guardar el dia que fue
	se puede agregar una razón pero tiene que ser el mismo administrador quien gestione eso
*/
