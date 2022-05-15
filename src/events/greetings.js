const greetings = require('./../data/greeting_replies.js');
const greetingTimer = new Set();

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot || !message.mentions.has(message.client.user.id))
            return;
        // Cooldown for greeting messages. Don't allow people to get more than 1 message every 5 minutes.
        if (greetingTimer.has(message.author.id)) return;
        if (message.content.includes('night')) {
            message.reply(
                greetings.night[
                    Math.floor(Math.random() * greetings.night.length)
                ],
            );
        } else if (message.content.includes('morning')) {
            message.reply(
                greetings.morning[
                    Math.floor(Math.random() * greetings.morning.length)
                ],
            );
        } else if (message.content.includes('afternoon')) {
            message.reply(
                greetings.afternoon[
                    Math.floor(Math.random() * greetings.afternoon.length)
                ],
            );
        } else if (message.content.includes('evening')) {
            message.reply(
                greetings.evening[
                    Math.floor(Math.random() * greetings.evening.length)
                ],
            );
        }
        // Babyjit -> Babyjit
        else if (message.content.includes('<:babyjit:759828360947302401>')) {
            message.reply('<:babyjit:759828360947302401>');
        }
        // Blob Heart Hug -> Blob Hug Love
        else if (
            message.content.includes('<:blobhearthug:723416575075680257>')
        ) {
            message.reply('<:blobhuglove:764792606592860211>');
        }
        greetingTimer.add(message.author.id);
        setTimeout(() => {
            greetingTimer.delete(message.author.id);
        }, 300000);
    },
};
