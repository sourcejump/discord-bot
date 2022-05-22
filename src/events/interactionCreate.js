const { modalSubmitGiveaway } = require('../functions/modalSubmitGiveaway');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId == 'giveaway') {
                modalSubmitGiveaway(interaction);
            }
        }
        if (!interaction.isCommand()) {
            return;
        }
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            return;
        }
    
        try {
            await command.execute(interaction);
        } catch (error) {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
            console.error(error);
        }
    }
}


function createGiveawayEmbed(description, timelimit, emoji, image, winner) {
    let standardEmbedFields = [{
        name: '🎁 Item',
        value: description
    },
    {
        name: '➡️ How to enter',
        value: 'React to this message with ' + emoji
    },
    {
        name: '🏆 Winners',
        value: 'Winners are picked at random, and prizes are sent automatically through a direct message here on Discord when the giveaway concludes. Make sure you allow direct messages from other members!'
    }]
    if (winner != '') {
        let embed = new MessageEmbed()
            .setColor('GREEN')
            .addFields(
                standardEmbedFields[0],
                standardEmbedFields[1],
                standardEmbedFields[2],
                {
                    name: '🏁 Giveaway ended',
                    value: 'Winner: ' + winner
                }
            )
            .setImage(image)
            .setFooter({text: `Giveaway ended`});
        return embed;
    }
    let embed = new MessageEmbed()
            .setColor('YELLOW')
            .addFields(
                standardEmbedFields[0],
                standardEmbedFields[1],
                standardEmbedFields[2]
            )
            .setImage(image)
            .setFooter({text:`Ending in ${Math.ceil(timelimit/60)} ${Math.ceil(timelimit/60) < 2?'hour':'hours'}`});
    return embed;
}