const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Te respondera con un pong!'),
	async execute(interaction) {
		// const permissions = interaction.member.roles.cache.some((role) => role.id == role.id == '1000577961260498950' || role.id == '1000577961260498948' || role.id == '1000577961260498947')
		// if(!permissions) return await interaction.reply({content: "No tienes los permisos sufientes.", ephemeral: true });
        await interaction.reply('Pong!');
		// console.log(interaction.member.roles.cache.map((role) => role.id))
		// console.log(interaction.member.roles.cache.some((role) => role.name == "perro"))
		// const {roles} = interaction.guild
		// roles.cache.map(role => console.log(role.name))
		// interaction.channel.send("Hola mundo")
		// const channel = interaction.client.channels.cache.get('1062943479069671424')
		// channel.send("HOLA PUTITOS")
		// console.log(channel)
		// console.log(interaction.user)
		// //1062943479069671424

	},
};