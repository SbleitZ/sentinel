import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  InteractionCollector,
  ComponentType,
  CacheType,
  CollectedInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { checkInUser, checkOutUser, getTime } from "../../controllers/date.controller";
import { STATUS } from "../../utils/status";
import { getUTC } from "../../utils/timezones";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Comando para iniciar el Embed de la asistencia.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "utility",
  async execute(interaction: ChatInputCommandInteraction) {
    if(!interaction.member) return await interaction.reply("Este comando solo puede ser usado dentro de un servidor.");
    const helpEmbed = new EmbedBuilder()
      .setColor(0x00cc00)
      .addFields({
        name: "Asistencia",
        value: "Reporta tu asistencia aquí",
        inline: false,
      },
      {
        name:'Entrada',
        value:'Marca tu entrada.',
        inline:true,
      },
      {
        name:'Salida',
        value:'Marca tu salida.',
        inline:true,
      })
      .setFooter({
        iconURL: interaction.client.user.avatarURL() || "",
        text: process.env.NAME_SERVER + " | Asistencia",
      });
    // 7571122-0
    // cuenta vista
    // 210607980
    // coopeuch
    // alfredo cordova
    const checkIn = new ButtonBuilder()
      .setCustomId("checkin")
      .setLabel("Entrada")
      .setStyle(ButtonStyle.Success);

    const checkOut = new ButtonBuilder()
      .setCustomId("checkout")
      .setLabel("Salida")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      checkIn,
      checkOut
    );
    await interaction.deferReply();
    const response = await interaction.editReply({
      embeds: [helpEmbed],
      components: [row],
    });
    const collector = new InteractionCollector(interaction.client, {
      componentType: ComponentType.Button,
    });
    collector.on("collect", async (interaction) => {
      if(interaction.customId === "checkin" || interaction.customId === "checkout"){
        return await EmbedCheck(interaction, { type: interaction.customId });
      }
      // if (interaction.customId == "checkin") {
      // } else if (interaction.customId == "checkout") {
      //   return await EmbedCheck(interaction, { type: "checkout" });
      // }
    });
    // si no recibe una respuesta, dara un error
  },
};
interface options {
  type: "checkin" | "checkout";
}
async function EmbedCheck(
  interaction: CollectedInteraction<CacheType>,
  options: options
) {
  const { type } = options;
  const response =
    type == "checkin"
      ? await checkInUser({
          serverId: interaction?.guild?.id,
          userId: interaction.member?.user.id,
        })
      : await checkOutUser({
          serverId: interaction?.guild?.id,
          userId: interaction.member?.user.id,
        });
  if (
    response ==
    (type == "checkin" ? STATUS.ASSISTANCE_SUCCESS : STATUS.CHECKOUT_SUCCESS)
  ) {
    const channel: any = interaction.client.channels.cache.get(
      process.env.CHANNEL_LOGS_ID || ""
    );

    console.log(interaction.client.user);
    const date = await getUTC();

    const embedResponse = new EmbedBuilder()
      .setTitle(
        type == "checkin" ? "Entrada registrada." : "Salida registrada."
      )
      .addFields(
        {
          name: type == "checkin" ? "Entrada" : "Salida",
          value: date.toString(),
          inline: false,
        },
        { name: "ID ", value: interaction.user.id, inline: false },
        {
          name: "Usuario",
          value:interaction.member?.user.username + ".",
          inline: false,
        },
      )
      .setColor(type == "checkin" ? 0x00cc00 : 0xff0000)
      .setFooter({
        iconURL: interaction.client.user.avatarURL() || "",
        text:
          process.env.NAME_SERVER +
          " | " +
          (type == "checkin" ? "Entrada" : "Salida"),
      });
      if(type == "checkout"){
        const value = await getTime(interaction.member?.user.id) || "";
        embedResponse.addFields(
          {
            name:'Tiempo trabajado',
            value:"`" + value +"`",
            inline:false,
          }
        )

      }
    interaction.reply({
      content:
        "Se ha registrado tu " +
        (type == "checkin" ? " entrada" : " salida") +
        " correctamente.",
      ephemeral: true,
    });
    return channel?.send({ embeds: [embedResponse] });
  } else if (response == STATUS.USER_DONT_EXISTS) {
    return await interaction.reply({
      content: STATUS.USER_DONT_EXISTS,
      ephemeral: true,
    });
  } else if (
    response ==
    (type == "checkin" ? STATUS.ERORR_WORKING : STATUS.ERROR_NOT_WORKING)
  ) {
    return await interaction.reply({
      content:
        type == "checkin" ? STATUS.ERORR_WORKING : STATUS.ERROR_NOT_WORKING,
      ephemeral: true,
    });
  }else if(response == STATUS.ERROR_DAY){
    return await interaction.reply({content:STATUS.ERROR_DAY,ephemeral:true});
  }else if(response == STATUS.REPEAT_DAY){
    return await interaction.reply({content:STATUS.REPEAT_DAY,ephemeral:true});
  }
  
  return interaction.reply(
    interaction.member?.user.username + "ha enviado su solicitud."
  );
}
