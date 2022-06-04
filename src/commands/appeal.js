const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const typeormConnection = require('../database/db');
let sqlTable = typeormConnection.getRepository('appeals');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Appeal a ban'),
    async execute(interaction) {
        sqlTable
            .find({
                where: {
                    discordID: interaction.member.id,
                },
            })
            .then((appeals) => {
                if (appeals.length) {
                    for (let i = 0; i < appeals.length; i++) {
                        if (appeals[i].accepted == null) {
                            interaction.reply({
                                content: 'You already have an open appeal.',
                                ephemeral: true,
                            });
                            return;
                        }
                    }
                }
                const modal = new Modal()
                    .setCustomId('banAppeal')
                    .setTitle('Ban Appeal')
                    .addComponents([
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('username')
                                .setLabel('Username')
                                .setStyle('SHORT')
                                .setPlaceholder('ex: John Doe')
                                .setRequired(true),
                        ),
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('steamid')
                                .setLabel('SteamID')
                                .setStyle('SHORT')
                                .setPlaceholder('STEAM_0:1:0')
                                .setRequired(true),
                        ),
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('reason')
                                .setLabel('Appeal Reason')
                                .setStyle('PARAGRAPH')
                                .setMaxLength(1024) //embed restrictions
                                .setPlaceholder('Reason for appeal')
                                .setRequired(true),
                        ),
                    ]);
                interaction.showModal(modal);
            });
    },
};
