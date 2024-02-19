import {
  SlashCommandBuilder,
  ChatInputCommandInteraction
} from "discord.js";
import { createUser } from "../../controllers/users.controller";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("addstaff")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Usuario que será añadido.")
        .setRequired(true)
    )
    .setDescription("Añade a un miembro!"),
  category: "",
  async execute(interaction: any) {
    const member = interaction.options.getMember("target");
    const response = await createUser({
      discordUserName: member?.user?.username || "",
      discordUserId: member.user.id || "",
      discordUserAvatar: interaction.member.guild.iconURL() || "",
    });
    if (response.length == 0) {
      interaction.client.users.send(
        member?.user?.id,
        "Has sido agregado a la lista de miembros en " +
          interaction?.member?.guild?.name
      );
      await interaction.reply(
        "El usuario" + member.user.username + " ha sido añadido."
      );
    } else {
      await interaction.reply(response + ".");
    }
  },
};
