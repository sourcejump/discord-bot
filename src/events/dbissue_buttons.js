const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const typeormConnection = require('../database/db');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.includes('dbissue')) return;
        let DATABASE_MANAGER_ROLE_ID = await typeormConnection
            .getRepository('configuration')
            .findOne({ where: { name: 'DATABASE_MANAGER_ROLE_ID' } });
        if (
            !interaction.member.roles.cache.some(
                (role) => role.id === DATABASE_MANAGER_ROLE_ID.value,
            )
        ) {
            interaction.reply({
                content:
                    'You do not have the permissions to resolve this issue.',
                ephemeral: true,
            });
            return;
        }
        const issueConfirmationMessage = (accept) => {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        accept
                            ? 'dbissue_accept_confirm'
                            : 'dbissue_reject_confirm',
                    )
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
            );
            const embed = new EmbedBuilder().addFields(
                {
                    name: 'Map Name',
                    value: interaction.message.embeds[0].fields[0].value,
                },
                {
                    name: 'Issue',
                    value: interaction.message.embeds[0].fields[1].value,
                },
                {
                    name: 'Message ID',
                    value: interaction.message.id,
                },
            );
            interaction.reply({
                content:
                    'Are you sure you want to **' +
                    (accept ? 'accept' : 'reject') +
                    '** these changes?',
                embeds: [embed],
                components: [row],
                ephemeral: true,
            });
        };

        if (interaction.customId == 'dbissue_accept') {
            issueConfirmationMessage(true);
        } else if (interaction.customId == 'dbissue_reject') {
            issueConfirmationMessage(false);
        }

        const issueConfirm = (accepted) => {
            interaction.channel.messages
                .fetch(interaction.message.embeds[0].fields[2].value)
                .then((msg) => {
                    const embed = new EmbedBuilder(msg.embeds[0].data);
                    embed.setColor(accepted ? 'Green' : 'Red').setAuthor({
                        name:
                            'Issue ' +
                            (accepted ? 'accepted' : 'denied') +
                            ` by ${interaction.member.user.tag}`,
                    });
                    msg.edit({
                        embeds: [embed],
                        components: [],
                    });
                });
            interaction.update({
                content: 'Issue ' + (accepted ? 'accepted' : 'denied'),
                components: [],
                embeds: [],
            });
        };

        if (interaction.customId == 'dbissue_accept_confirm') {
            issueConfirm(true);
        } else if (interaction.customId == 'dbissue_reject_confirm') {
            issueConfirm(false);
        }
    },
};
