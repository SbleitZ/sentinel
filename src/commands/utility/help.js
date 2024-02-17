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
            .setCustomId('checkin')
            .setLabel('Entrada')
            .setStyle(ButtonStyle.Success);

        const checkOut = new ButtonBuilder()
            .setCustomId('checkout')
            .setLabel('Salida')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(checkIn, checkOut);
        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'checkin'){
            console.log("Confirmado")
        }
        await interaction.deferReply();
        return await interaction.editReply({
            embeds: [helpEmbed],
            components: [row],
        })
    },
};