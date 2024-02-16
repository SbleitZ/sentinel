const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Comando para conocer utilidades del bot.'),
    category: 'utility',
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("Comandos disponibles")
            .setColor(0x00CC00)
            .addFields(
                { name: '/ban', value: 'Para banear usuarios.', inline: false },
            )
            .setFooter({ iconURL: interaction.client.user.avatarURL(), text: "ULTRARK MASSIVE | Asistencia" })

        const checkIn = new ButtonBuilder()
            .setCustomId('input')
            .setLabel('Entrada')
            .setStyle(ButtonStyle.Success);

        const checkOut = new ButtonBuilder()
            .setCustomId('output')
            .setLabel('Salida')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(checkIn, checkOut);

        await interaction.deferReply();
        return await interaction.editReply({
            embeds: [helpEmbed],
            components: [row],
        })
    },
};