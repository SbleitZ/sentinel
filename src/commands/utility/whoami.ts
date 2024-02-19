import { Channel, CommandInteraction, DMChannel, SlashCommandBuilder, TextChannel } from "discord.js";
import { getUser } from "../../controllers/users.controller";
module.exports = {

	data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('Obtener tu ultima información.!'),
	permissions:["Administrator"],
	async execute(interaction:CommandInteraction){

		const h = interaction.client.channels.cache.get("id") as TextChannel;

		console.log(JSON.stringify(interaction.guild?.channels,null,2))
		const user = await getUser(interaction.user.id);
		console.log(JSON.stringify(user));
		await interaction.reply("```ts\n" + JSON.stringify(user,null,2) + "```");
	},

}

/*
	cada dia dos horas después de la hora de salida marcada
	recorrer todos los usuarios para que en caso de que no tengan un date
	de ese mismo dia, marcarles la inasistencia y guardar el dia que fue
	se puede agregar una razón pero tiene que ser el mismo administrador quien gestione eso
*/
