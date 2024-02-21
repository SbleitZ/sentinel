import {
  PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { removeUserAndDates } from "../../controllers/users.controller";
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("deletestaff")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("Usuario que será eliminado de la base de datos.")
          .setRequired(true)
      )
      .setDescription("Eliminaras a un miembro del equipo.!")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: "",
    async execute(interaction: any) {
      if(!interaction.member) return await interaction.reply("Este comando solo puede ser usado en un servidor")
      const member = interaction.options.getMember("target");
      const response = await removeUserAndDates(member.user.id || "",);
      if (response.length == 0) {
        try {
            await interaction.client?.users?.send(
              member?.user?.id,
              "Has sido eliminado de la lista de miembros en " +
                interaction?.member?.guild?.name + " por " + interaction.user.username + "."
            );
            await interaction.reply(
              "El usuario " + member.user.username + " ha sido eliminado."
            );
        } catch (error) {
            console.log("Ocurrio un error en el comando delete, al intentar enviar un mensaje directo.")
            await interaction.reply({content:"No se pudo enviar un DM al usuario "+ member.user.username +", pero el usuario fue eliminado.", ephemeral:true})
        }
      } else {
        await interaction.reply(response + ".");
      }
    },
  };
  