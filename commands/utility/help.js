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
                { name: '/kick', value: 'Para expulsar usuarios.', inline: false },
                { name: '/say', value: 'Para enviar un mensaje.', inline: false },
                { name: '/timeout', value: 'Para aislar a un usuario.', inline: false },
            )
            .setFooter({ iconURL: interaction.client.user.avatarURL(), text: "ULTRARK MASSIVE | Ayuda" })

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Entrada')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Salida')
            .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder()
            .addComponents(confirm, confirm);
        await interaction.deferReply();
        return await interaction.editReply({
            embeds: [helpEmbed],
            components: [row],
        })
    },
};