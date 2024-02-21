import { Channel, CommandInteraction, DMChannel, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { getUser } from "../../controllers/users.controller";
module.exports = {

	data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('Obtener tu ultima información.!'),
	permissions:["Administrator"],
	async execute(interaction:CommandInteraction){
		const h = interaction.client.channels.cache.get("id") as TextChannel;
		const user = await getUser(interaction.user.id,false);
		if(!user) return await interaction.reply({content:"No se han encontrado tus datos.",ephemeral:true})
		const whoamiEmbed = new EmbedBuilder()
			.setColor(0x00cc00)
			.setThumbnail(user.discordUserAvatar)
			.addFields({name:'Username',value:user?.discordUserName,inline:true},
			{name:'ID',value:user.discordUserId,inline:true},
			{name:'Fecha de ingreso',value:user.createdAt.toString(),inline:false})
			.setFooter({
				iconURL: interaction.client.user.avatarURL() || "",
				text: process.env.NAME_SERVER + " | Mi información",
			});
		// console.log(JSON.stringify(interaction.guild?.channels,null,2))
		// console.log(JSON.stringify(user));
		await interaction.reply({embeds:[whoamiEmbed]})

		// await interaction.reply("```ts\n" + JSON.stringify(user,null,2) + "```");
	},

}

/*
	cada dia dos horas después de la hora de salida marcada
	recorrer todos los usuarios para que en caso de que no tengan un date
	de ese mismo dia, marcarles la inasistencia y guardar el dia que fue
	se puede agregar una razón pero tiene que ser el mismo administrador quien gestione eso
*/
