const { time } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

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

module.exports = {
    name: 'modalSubmit',
    async execute (modal) {
        try {
            if (modal.customId == 'giveaway') {
                const channel = '838711380076396574';
                const gamekey = modal.getTextInputValue('gamekey');
                const description = modal.getTextInputValue('description');
                let timelimit = modal.getTextInputValue('timelimit');
                if (isNaN(timelimit)) {
                    await modal.reply({content:'Timelimit has to be integer.', ephemeral: true});
                    return;
                }
                const emoji = `${modal.client.emojis.cache.find(emoji => emoji.name == modal.getTextInputValue('emoji'))}`;
                if (emoji == 'undefined') {
                    await modal.reply({content:'Emoji not found. Only custom server-emojis work.', ephemeral:true});
                    return;
                }
                let image = '';
                if (modal.getTextInputValue('image') != null) {
                    image = modal.getTextInputValue('image');
                }
    
                let embed = createGiveawayEmbed(description,timelimit,emoji,image,'');
    
                let msg = await modal.client.channels.cache.get(channel).send({embeds: [embed]});
                msg.react(emoji);
                
                let interval = setInterval(() => {
                    timelimit -= 1;
                    embed = createGiveawayEmbed(description,timelimit,emoji,image,'');
                    msg.edit({embeds: [embed]});
                    if (timelimit < 1) {
                        clearInterval(interval);
                        let winner;
                        msg.reactions.cache.map(async (reaction) => {
                            let emojiName = emoji.split(':')[1];
                            if (reaction.emoji.name !== emojiName) return;
                            let usersThatReacted = [];
                            let reactedUsers = await reaction.users.fetch();
                            reactedUsers.map((user) => {
                                if (user != msg.author) {
                                    usersThatReacted.push(user);
                                }
                            });
                            if (usersThatReacted.length == 0) {
                                winner = 'No one reacted! :('
                            } else {
                                winner = usersThatReacted[Math.floor(Math.random()*usersThatReacted.length)];
                                winner.send(`Congratulations! You won the giveaway for ${description}. \nYour Game key: ${gamekey}`);
                            }
                            
                            embed = createGiveawayEmbed(description,timelimit,emoji,image,winner.toString());
                            msg.edit({embeds: [embed]});
                        });
                        
                    }
                }, 60000);
                await modal.reply({content: 'Done!', ephemeral: true});
            };
        } catch (e) {
            console.log(e);
        }
    }
}
