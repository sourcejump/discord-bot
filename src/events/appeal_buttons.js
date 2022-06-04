const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const typeormConnection = require('../database/db');
let sqlTable = typeormConnection.getRepository('appeals');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const appealButtonMessage = (accept) => {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(
                        accept
                            ? 'appeal_accept_confirm'
                            : 'appeal_deny_confirm',
                    )
                    .setLabel('Confirm')
                    .setStyle('SUCCESS'),
            );
            const embed = new MessageEmbed().addFields(
                {
                    name: 'Username',
                    value: interaction.message.embeds[0].fields[0].value,
                    inline: true,
                },
                {
                    name: 'Steam ID',
                    value: interaction.message.embeds[0].fields[1].value,
                    inline: true,
                },
                {
                    name: 'Discord ID',
                    value: interaction.message.embeds[0].fields[2].value,
                    inline: true,
                },
                {
                    name: 'Message ID',
                    value: interaction.message.id,
                },
            );
            interaction.reply({
                content:
                    'Are you sure you want to **' +
                    (accept ? 'accept' : 'deny') +
                    '** this appeal? If you wish to cancel, dismiss this message.',
                components: [row],
                embeds: [embed],
                ephemeral: true,
            });
        };

        if (interaction.customId == 'appeal_accept') {
            appealButtonMessage(true);
        } else if (interaction.customId == 'appeal_deny') {
            appealButtonMessage(false);
        }

        const appealConfirm = (accepted) => {
            interaction.client.users
                .fetch(interaction.message.embeds[0].fields[2].value)
                .then((user) => {
                    interaction.channel.messages
                        .fetch(interaction.message.embeds[0].fields[3].value)
                        .then((msg) => {
                            const embed = msg.embeds[0];
                            embed
                                .setColor(accepted ? 'GREEN' : 'RED')
                                .setAuthor({
                                    name:
                                        'Appeal ' +
                                        (accepted ? 'accepted' : 'denied') +
                                        ` by ${interaction.member.user.tag}`,
                                });
                            msg.edit({
                                embeds: [embed],
                                components: [],
                            });
                        });
                    sqlTable
                        .find({
                            where: {
                                discordID:
                                    interaction.message.embeds[0].fields[2]
                                        .value,
                                messageID:
                                    interaction.message.embeds[0].fields[3]
                                        .value,
                            },
                        })
                        .then((appeal) => {
                            typeormConnection
                                .createQueryBuilder()
                                .update('appeals')
                                .set({
                                    dateResolved: Date.now(),
                                    resolvedBy: interaction.member.id,
                                    accepted: accepted,
                                })
                                .where('discordID = :discordID', {
                                    discordID:
                                        interaction.message.embeds[0].fields[2]
                                            .value,
                                })
                                .andWhere('messageID = :messageID', {
                                    messageID:
                                        interaction.message.embeds[0].fields[3]
                                            .value,
                                })
                                .execute();
                        });
                    user.send(
                        'Your appeal has been ' +
                            (accepted ? 'accepted' : 'denied'),
                    );

                    interaction.update({
                        content: 'Appeal ' + (accepted ? 'accepted' : 'denied'),
                        components: [],
                        embeds: [],
                    });
                });
        };

        if (interaction.customId == 'appeal_accept_confirm') {
            appealConfirm(true);
        } else if (interaction.customId == 'appeal_deny_confirm') {
            appealConfirm(false);
        }
    },
};
