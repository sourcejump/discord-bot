const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const typeormConnection = require('../database/db');

const discordPics = {
    0: 'https://i.imgur.com/T9l6udJ.png',
    1: 'https://i.imgur.com/iqbgcoo.png',
    2: 'https://i.imgur.com/RAHIoie.png',
    3: 'https://i.imgur.com/oPVaywI.png',
    4: 'https://i.imgur.com/HHs9Pwf.png',
    5: 'https://i.imgur.com/5U1Vrqb.png',
    6: 'https://i.imgur.com/WNT8c0k.png',
    7: 'https://i.imgur.com/e4PQWp8.png',
    8: 'https://i.imgur.com/J7sNqiZ.png',
    9: 'https://i.imgur.com/urD420H.png',
    10: 'https://i.imgur.com/JQN0Mrz.png',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wr')
        .setDescription(
            'Retrieve the current world record for a specified map from the SourceJump database.',
        )
        .addStringOption((option) =>
            option
                .setName('map')
                .setDescription('Name of the map to check')
                .setRequired(true),
        ),
    async execute(interaction) {
        let SOURCEJUMP_API_KEY = await typeormConnection
            .getRepository('configuration')
            .findOne({ where: { name: 'SOURCEJUMP_API_KEY' } });
        let SOURCEJUMP_API_URL = await typeormConnection
            .getRepository('configuration')
            .findOne({ where: { name: 'SOURCEJUMP_API_URL' } });

        const fetch = require('node-fetch');
        const map = interaction.options.getString('map');
        const apiOptions = {
            method: 'GET',
            headers: {
                'api-key': SOURCEJUMP_API_KEY.value,
            },
        };

        fetch(`${SOURCEJUMP_API_URL.value}/records/${map}`, apiOptions)
            .then((response) => response.json())
            .then((body) => {
                if (body.length === 0) {
                    return interaction.reply({
                        content: `No times found for ${map}.`,
                        ephemeral: true,
                    });
                }

                let icon_url = discordPics[body[0].tier];

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor({
                        name: body[0].map.toString(),
                        iconURL: icon_url,
                        url: `https://sourcejump.net/records/map/${body[0].map.toString()}`,
                    })
                    .addFields(
                        {
                            name: 'Runner: ',
                            value: `[${body[0].name.toString()}](https://steamcommunity.com/profiles/${body[0].steamid.toString()})`,
                            inline: true,
                        },
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true,
                        },
                        {
                            name: 'Time: ',
                            value: `${body[0].time.toString()} (${body[0].wrDif.toString()})`,
                            inline: true,
                        },
                        {
                            // It's shifted to the right so it appears correct on smaller screens
                            name: 'Additional',
                            value: `**Sync:** ${body[0].sync.toString()} **Strafes:** ${body[0].strafes.toString()} **Jumps:** ${body[0].jumps.toString()}
**Date:** ${body[0].date.toString()} 
**Run ID:** [${body[0].id.toString()}](https://www.sourcejump.net/records/id/${body[0].id.toString()})
**Points:** ${body[0].points.toString()}`,
                        },
                        {
                            name: 'Server: ',
                            value: body[0].hostname.toString(),
                        },
                        {
                            name: 'Top 5: ',
                            value: `[${body[1].name.toString()}](https://steamcommunity.com/profiles/${body[1].steamid.toString()}): ${body[1].time.toString()} **${body[1].wrDif.toString()}**
[${body[2].name.toString()}](https://steamcommunity.com/profiles/${body[2].steamid.toString()}): ${body[2].time.toString()} **${body[2].wrDif.toString()}**
[${body[3].name.toString()}](https://steamcommunity.com/profiles/${body[3].steamid.toString()}): ${body[3].time.toString()} **${body[3].wrDif.toString()}**
[${body[4].name.toString()}](https://steamcommunity.com/profiles/${body[4].steamid.toString()}): ${body[4].time.toString()} **${body[4].wrDif.toString()}**`,
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'SourceJump.net' });

                if (body[0].video) {
                    embed.addFields({
                        name: 'Video: ',
                        value: `[YouTube](https://www.youtube.com/watch?v=${body[0].video.toString()})`,
                    });
                }

                return interaction.reply({ embeds: [embed] });
            });
    },
};
