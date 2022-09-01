const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionType,
} = require('discord.js');
const typeormConnection = require('../database/db');
module.exports = {
    name: 'interactionCreate',
    async execute(modal) {
        if (
            modal.type === InteractionType.ModalSubmit &&
            modal.customId == 'newDBIssue'
        ) {
            let guild = modal.client.guilds.resolve(process.env.GUILD_ID);
            let DATABASE_ISSUES_CHANNEL_ID = await typeormConnection
                .getRepository('configuration')
                .findOne({ where: { name: 'DATABASE_ISSUES_CHANNEL_ID' } });
            guild.channels
                .fetch(DATABASE_ISSUES_CHANNEL_ID.value)
                .then(async (channel) => {
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setTitle('New Database Issue')
                        .addFields(
                            {
                                name: 'Map Name: ',
                                value: modal.components[0].components[0].value,
                            },
                            {
                                name: 'Issue: ',
                                value: modal.components[1].components[0].value,
                            },
                            {
                                name: 'Visual Information: ',
                                value:
                                    modal.components[2].components[0].value ||
                                    'None',
                            },
                        );
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('dbissue_accept')
                                .setLabel('Accept')
                                .setStyle(ButtonStyle.Success),
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('dbissue_reject')
                                .setLabel('Deny')
                                .setStyle(ButtonStyle.Danger),
                        );

                    channel.send({ embeds: [embed], components: [row] });
                });

            modal.reply({
                content: 'Your issue has been submitted.',
                ephemeral: true,
            });
        }
    },
};
