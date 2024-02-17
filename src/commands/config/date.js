const { SlashCommandBuilder} = require('discord.js');
const timezones = require('../../utils/timezones');
const { setConfig } = require('../../controllers/config.controller');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Actualiza la configuración del bot!')
        .addStringOption(option => option.setName('zona_horaria').setDescription('Zona horaria con la que se calculara los tiempos.')
        .addChoices(
            ...timezones.data.map(({city,locale,timeZone}) => {
                return {name:city,value:locale+","+timeZone}
            })
        )
        .setRequired(true)),
    category:"Config",
	async execute(interaction) {
        const timeZone = interaction.options.getString('zona_horaria');
        // 0 locale | 1 timezone
        const values = timezones.data.filter((tz) => timeZone.split(",")[1] == tz.timeZone)[0]
        await setConfig({
            timeZone:values.timeZone,
            city:values.city,
            locale:values.locale,
            serverName:interaction.member.guild.name,
            serverId:interaction.member.guild.id,
            serverAvatar:interaction.member.guild.iconURL()
        })
        const city = values.city || "";
        await interaction.reply("La zona horaria se actualizo a " + city)
	}, 
};