import { GatewayIntentBits } from "discord.js";
import { Bot } from "./Bot";

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Bot([ Guilds, MessageContent, GuildMessages, GuildMembers]);
client.init();