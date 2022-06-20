const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const typeormConnection = require('../database/db');

module.exports = {
    name: 'interactionCreate',
    async execute(modal) {
        if (modal.isModalSubmit() && modal.customId == 'banAppeal') {
            let guild = modal.client.guilds.resolve(process.env.GUILD_ID);
            guild.channels
                .fetch(process.env.BAN_APPEAL_CHANNEL_ID)
                .then(async (channel) => {
                    const embed = new MessageEmbed()
                        .setColor('ORANGE')
                        .setTitle(
                            'Ban Appeal - ' +
                                modal.member.displayName +
                                ' (' +
                                modal.member.user.tag +
                                ')',
                        )
                        .addFields(
                            {
                                name: 'Username: ',
                                value: modal.components[0].components[0].value,
                            },
                            {
                                name: 'Steam ID: ',
                                value: modal.components[1].components[0].value,
                            },
                            {
                                name: 'Discord ID: ',
                                value: modal.member.id,
                            },
                            {
                                name: 'Reason: ',
                                value: modal.components[2].components[0].value,
                            },
                        );
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('appeal_accept')
                                .setLabel('Accept')
                                .setStyle('SUCCESS'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('appeal_deny')
                                .setLabel('Deny')
                                .setStyle('DANGER'),
                        );

                    channel
                        .send({
                            embeds: [embed],
                            components: [row],
                        })
                        .then((message) => {
                            typeormConnection
                                .createQueryBuilder()
                                .insert()
                                .into('appeals')
                                .values({
                                    messageID: message.id,
                                    username:
                                        modal.components[0].components[0].value,
                                    steamID:
                                        modal.components[1].components[0].value,
                                    reason: modal.components[2].components[0]
                                        .value,
                                    discordID: modal.member.id,
                                    dateAdded: Date.now(),
                                })
                                .execute();
                        });

                    modal.reply({
                        content:
                            'Ban appeal sent successfuly. You will be notified once an admin resolves your appeal.',
                        ephemeral: true,
                    });
                });
        }
    },
};
