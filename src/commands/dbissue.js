const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dbissue')
        .setDescription(
            'Report an issue with the database to database managers',
        ),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('newDBIssue')
            .setTitle('Report a database issue')
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('mapname')
                        .setLabel('Map name')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('eg: bhop_eazy')
                        .setRequired(true),
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Description of the issue')
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1024) //embed restrictions
                        .setPlaceholder('Explain the issue clearly')
                        .setRequired(true),
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('visual')
                        .setLabel('Link to video/screenshot of the issue')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('YouTube link/Imgur link etc.')
                        .setRequired(false),
                ),
            ]);
        interaction.showModal(modal);
    },
};
