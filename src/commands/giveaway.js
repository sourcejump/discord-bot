const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('An admin command for creating giveaways'),
    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('giveaway')
            .setTitle('Create a giveaway')
            .addComponents([
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('gameKey')
                        .setLabel('Game Key')
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('description')
                        .setLabel('Description')
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('timeLimit')
                        .setLabel('Time Limit (In Minutes)')
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('emoji')
                        .setLabel('Emoji (To React With)')
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('imageUrl')
                        .setLabel('Image URL')
                        .setStyle('SHORT')
                        .setRequired(false),
                ),
            ]);
 
        await interaction.showModal(modal);
    },
};