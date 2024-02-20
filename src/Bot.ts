import { config} from "dotenv";
import {schedule} from "node-cron";
import {ActivityType, Client, Collection, Events, GatewayIntentBits, Snowflake } from "discord.js";
import { join } from "path";
import { readdirSync} from "fs";
import { Command } from "./types/command";
import { getConfig } from "./controllers/config.controller";
import { getUsers } from "./controllers/users.controller";
config();
interface IConfig{
    TOKEN:string | undefined;
    CLIENT_ID:string | undefined;
}
export class Bot extends Client{
    config : IConfig;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<Snowflake, number>>;
    constructor(GTIntents:GatewayIntentBits[]){
        super({intents:[...GTIntents]});
        this.config = {
            TOKEN:process.env.TOKEN,
            CLIENT_ID:process.env.CLIENT_ID,
        }
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.once(Events.ClientReady, (c) => {
            this.initCommands();
            this.interactionCreate();
            // this.sendNotifications(c);
            console.log(`Bot encendido Username:${c.user.tag}`);
            c.user.setActivity({
                name:"a ver, que pasa",
                type:ActivityType.Streaming
            })
            this.initTasks(c);
            // poner las tareas aqui
        });
    }
    interactionCreate(){
        this.on(Events.InteractionCreate, async (interaction:any) => {
            if (!interaction.isChatInputCommand()) return;
        
            const command = interaction.client.commands.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }
    initCommands(){
        this.commands = new Collection();
        this.cooldowns = new Collection();
        const foldersPath = join(__dirname, 'commands');
        const commandFolders = readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = join(foldersPath, folder);
            const commandFiles = readdirSync(commandsPath).filter((file:string) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
    init(){
        this.login(this.config.TOKEN)
    }
    async initTasks(client: Client<true>){
        //tareas programadas
        // avisar a todos los usuarios 15 minutos antes de la entrada establecida
        const config = await getConfig();
        if(!config){
            return console.log("Error en la automatización de avisos por falta de configuración.")
        }
        const entryTimes = config.entryTime.split(":")
        const entryHour = entryTimes[0];
        const entryMinute = entryTimes[1];
        const entryRanges = `${entryMinute} ${entryHour} * * *`;
        schedule(entryRanges, () => {
            this.sendNotifications(client)
            console.log('Se inicio el aviso a usuarios');
          }, {
            scheduled: true,
            timezone: config.timeZone
        });
        console.log("Se han establecido las notificaciones de manera correcta.")
        // const exitTimes = config.exitTime.split(":")
        // const exitMinute = exitTimes[1]
        // const exitHour = exitTimes[0]
        // const exitRanges = `${exitMinute} ${exitHour} * * *`;
        // schedule(exitRanges, () => {
        //     console.log(client.users)
        //     console.log('Se inicio el aviso a usuarios');
        //   }, {
        //     scheduled: true,
        //     timezone: config.timeZone
        // });
    }
    async sendNotifications(client: Client){
        const users = await getUsers();
        if(!users) return console.log("No se han encontrado usuarios");
        users.map(async ({discordUserId})=>{
            const userById = await client.users.fetch(discordUserId)
            userById.send("Faltan pocos minutos para que inicie el horario de entrada, recuerda marcarlo.").catch(()=>console.log("No se pudo enviar el mensaje directo a " + userById.username))

        })
    }
}