const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    SlashCommandBuilder,
    TextInputStyle,
} = require('discord.js');
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
                const modal = new ModalBuilder()
                    .setCustomId('banAppeal')
                    .setTitle('Ban Appeal')
                    .addComponents([
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('username')
                                .setLabel('Username')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('ex: John Doe')
                                .setRequired(true),
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('steamid')
                                .setLabel('SteamID')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('STEAM_0:1:0')
                                .setRequired(true),
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel('Appeal Reason')
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(1024) //embed restrictions
                                .setPlaceholder('Reason for appeal')
                                .setRequired(true),
                        ),
                    ]);
                interaction.showModal(modal);
            });
    },
};
