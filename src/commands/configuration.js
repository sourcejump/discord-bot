const {
    ModalBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    TextInputBuilder,
    SlashCommandBuilder,
    TextInputStyle,
} = require('discord.js');
const typeormConnection = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Change a configuration setting'),
    async execute(interaction) {
        typeormConnection
            .getRepository('configuration')
            .find()
            .then((rows) => {
                let options = [];
                rows.forEach(
                    (row, i) =>
                        options.push({ label: row.name, value: row.name }), //To match SelectMenuBuilder() options format
                );
                let row = new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('configuration_name')
                        .setPlaceholder('Select a setting')
                        .addOptions(options),
                );
                interaction.reply({
                    content: 'Select the option.',
                    components: [row],
                    ephemeral: true,
                });
            });
    },
};
