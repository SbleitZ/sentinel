import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { test } from "../../controllers/config.controller";

module.exports = {

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Te respondera con un pong!'),
	permissions:["Administrator"],
	async execute(interaction:CommandInteraction){
		await interaction.reply('Pong!');
		console.log(JSON.stringify(await test(interaction.member?.user.id)));
	},

}

/*
	cada dia dos horas después de la hora de salida marcada
	recorrer todos los usuarios para que en caso de que no tengan un date
	de ese mismo dia, marcarles la inasistencia y guardar el dia que fue
	se puede agregar una razón pero tiene que ser el mismo administrador quien gestione eso
*/
