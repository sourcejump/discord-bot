const typeormConnection = require('../database/db');
const {
    InteractionType,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (
            interaction.isSelectMenu() &&
            interaction.customId == 'configuration_name'
        ) {
            typeormConnection
                .getRepository('configuration')
                .find({
                    where: {
                        name: interaction.values[0],
                    },
                })
                .then((value) => {
                    let modal = new ModalBuilder()
                        .setCustomId(
                            'configuration_modal' + interaction.values[0],
                        )
                        .setTitle('Configure')
                        .addComponents([
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setValue(value[0].value ?? '')
                                    .setCustomId('value')
                                    .setLabel('Value')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true),
                            ),
                        ]);
                    interaction.showModal(modal);
                });
        }
        if (
            interaction.type === InteractionType.ModalSubmit &&
            interaction.customId.includes('configuration_modal')
        ) {
            typeormConnection
                .createQueryBuilder()
                .update('configuration')
                .set({
                    value: interaction.components[0].components[0].value,
                })
                .where('name = :name', {
                    name: interaction.customId.replace(
                        'configuration_modal',
                        '',
                    ),
                })
                .execute();
            interaction.update({
                content: 'Configuration updated. You can close this message.',
                components: [],
                ephemeral: true,
            });
        }
    },
};
