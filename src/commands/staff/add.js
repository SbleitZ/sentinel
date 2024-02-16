const { SlashCommandBuilder} = require('discord.js');
const { createUser } = require('../../controllers/users.controller');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addstaff')
        .addUserOption(option => option.setName('target').setDescription('Usuario que será añadido.').setRequired(true))
		.setDescription('Añade a un miembro!'),
    category:"",
	async execute(interaction) {
        const member = interaction.options.getMember('target');
        interaction.client.users.send(member.user.id, 'Has sido agregado a la lista de miembros en '+ interaction.member.guild.name);
            const response = await createUser({
                discordName:member.user.username,
                discordId:member.user.id,
            });
            if(response.length == ""){
                await interaction.reply("El usuario" + member.user.username + "ha sido añadido.");
            }else{
                await interaction.reply(response + ".")
            }
        
	},
};