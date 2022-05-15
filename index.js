require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const greetings = require('./src/data/greeting_replies.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Load commands from command files.
client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Register commands with Discord's API.
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log('Successfully registered commands!');
    } catch (err) {
        console.error(err);
    }
})();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
        console.error(error);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.mentions.has(client.user.id)) return;
    if(message.content.includes("night")){
        message.reply(greetings.night[Math.floor(Math.random()*greetings.night.length)]);
    }
    else if(message.content.includes("morning")){
        message.reply(greetings.morning[Math.floor(Math.random()*greetings.morning.length)]);
    }
    else if(message.content.includes("afternoon")){
        message.reply(greetings.afternoon[Math.floor(Math.random()*greetings.afternoon.length)]);
    }
    else if(message.content.includes("evening")){
        message.reply(greetings.evening[Math.floor(Math.random()*greetings.evening.length)]);
    }
    // Babyjit -> Babyjit
    else if(message.content.includes("<:babyjit:759828360947302401>")) {
        message.reply("<:babyjit:759828360947302401>");
    }
    // Blob Heart Hug -> Blob Hug Love
    else if(message.content.includes("<:blobhearthug:723416575075680257>")) {
        message.reply("<:blobhuglove:764792606592860211>");
    }
});


client.login(token);
