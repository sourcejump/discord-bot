const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Appeal a ban'),
    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('banAppeal')
            .setTitle('Ban Appeal')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('username')
                    .setLabel('Username')
                    .setStyle('SHORT')
                    .setPlaceholder('ex: John Doe')
                    .setRequired(true),
            )
            .addComponents(
                new TextInputComponent()
                    .setCustomId('steamid')
                    .setLabel('SteamID')
                    .setStyle('SHORT')
                    .setPlaceholder('STEAM_0:1:0')
                    .setRequired(true),
            )
            .addComponents(
                new TextInputComponent()
                    .setCustomId('reason')
                    .setLabel('Appeal Reason')
                    .setStyle('LONG')
                    .setPlaceholder('Reason for appeal')
                    .setRequired(true),
            );
        showModal(modal, {
            client: interaction.client,
            interaction: interaction,
        });
    },
};
