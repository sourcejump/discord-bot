const { SlashCommandBuilder } = require('@discordjs/builders');
const modal = require('discord-modals');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('An admin command for creating giveaways'),
    async execute(interaction) {
        modal(interaction.client);
        let m = new modal.Modal()
                .setCustomId('giveaway')
                .setTitle('Create a giveaway')
                .addComponents([
                    new modal.TextInputComponent()
                    .setCustomId('gamekey')
                    .setLabel('Game key')
                    .setStyle('SHORT')
                    .setRequired(true),
                    new modal.TextInputComponent()
                    .setCustomId('description')
                    .setLabel('Description')
                    .setStyle('SHORT')
                    .setRequired(true),
                    new modal.TextInputComponent()
                    .setCustomId('timelimit')
                    .setLabel('Time limit (minutes)')
                    .setStyle('SHORT')
                    .setRequired(true),
                    new modal.TextInputComponent()
                    .setCustomId('emoji')
                    .setLabel('Emoji to react with (without ::)')
                    .setStyle('SHORT')
                    .setRequired(true),
                    new modal.TextInputComponent()
                    .setCustomId('image')
                    .setLabel('Image')
                    .setStyle('SHORT')
                    .setRequired(false)
                ]);
        return await modal.showModal(m, {
            interaction: interaction,
            client: interaction.client
        })
    }
};