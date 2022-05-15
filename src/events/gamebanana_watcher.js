require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    execute: async (client) => {
        let cssMaps = [];
        let csgoMaps = [];
        const cssUrl =
            'https://gamebanana.com/mods/cats/5568?api=SubmissionsListModule';
        const csgoUrl =
            'https://gamebanana.com/mods/cats/5422?api=SubmissionsListModule';
        let guild = client.guilds.resolve(process.env.GUILD_ID);
        guild.channels
            .fetch(process.env.NEW_MAPS_CHANNEL_ID)
            .then((GuildChannel) => {
                GuildChannel.fetch().then((channel) => {
                    setInterval(async () => {
                        fetch(cssUrl)
                            .then((data) => data.text())
                            .then((body) => {
                                body = JSON.parse(body);
                                res = body['_aCellValues'];

                                let modID = res[0]['_sProfileUrl'].replace(
                                    'https://gamebanana.com/mods/',
                                    '',
                                );
                                let mapPreviewImage = `https://gamebanana.com/mods/embeddables/${modID}?type=large`;
                                let mapName = res[0]['_sName'];
                                let mapAuthor = res[0]['_aOwner']['_sUsername'];
                                let mapDL = `https://gamebanana.com/mods/${modID}`;
                                let updated = false;

                                if (cssMaps.find((x) => x.name == mapName)) {
                                    // If the map has not changed since last time we checked it.
                                    if (
                                        res[0]['_tsDateUpdated'] ==
                                        cssMaps.find((x) => x.name == mapName)
                                            .dateLastUpdated
                                    )
                                        return;
                                    else updated = true;
                                }
                                // Add the new map object to the array to prevent duplicate messages.

                                cssMaps.push({
                                    name: mapName,
                                    dateAdded: res[0]['_tsDateAdded'],
                                    dateLastUpdated: res[0]['_tsDateUpdated'],
                                });

                                const embed = new MessageEmbed()
                                    .setTitle(
                                        updated
                                            ? 'CS:S - Map Updated'
                                            : 'CS:S - New Map',
                                    )
                                    .setColor(updated ? 'YELLOW' : '#00D166')
                                    .addFields([
                                        {
                                            name: 'Map',
                                            value: `${mapName} `,
                                        },
                                        {
                                            name: 'Creator',
                                            value: `${mapAuthor} `,
                                        },
                                        {
                                            name: 'Download',
                                            value: `${mapDL} `,
                                        },
                                    ])
                                    .setImage(mapPreviewImage);
                                channel.send({
                                    embeds: [embed],
                                });
                            });
                        fetch(csgoUrl)
                            .then((data) => data.text())
                            .then((body) => {
                                body = JSON.parse(body);
                                res = body['_aCellValues'];

                                let modID = res[0]['_sProfileUrl'].replace(
                                    'https://gamebanana.com/mods/',
                                    '',
                                );
                                let mapPreviewImage = `https://gamebanana.com/mods/embeddables/${modID}?type=large`;
                                let mapName = res[0]['_sName'];
                                let mapAuthor = res[0]['_aOwner']['_sUsername'];
                                let mapDL = `https://gamebanana.com/mods/${modID}`;
                                let updated = false;

                                if (csgoMaps.find((x) => x.name == mapName)) {
                                    // If the map has not changed since last time we checked it.
                                    if (
                                        res[0]['_tsDateUpdated'] ==
                                        csgoMaps.find((x) => x.name == mapName)
                                            .dateLastUpdated
                                    )
                                        return;
                                    else updated = true;
                                }

                                // Add the new map object to the array to prevent duplicate messages.
                                csgoMaps.push({
                                    name: mapName,
                                    dateAdded: res[0]['_tsDateAdded'],
                                    dateLastUpdated: res[0]['_tsDateUpdated'],
                                });

                                const embed = new MessageEmbed()
                                    .setTitle(
                                        updated
                                            ? 'CS:GO - Map Updated'
                                            : 'CS:GO - New Map',
                                    )
                                    .setColor(updated ? 'YELLOW' : '#00D166')
                                    .addFields([
                                        {
                                            name: 'Map',
                                            value: `${mapName} `,
                                        },
                                        {
                                            name: 'Creator',
                                            value: `${mapAuthor} `,
                                        },
                                        {
                                            name: 'Download',
                                            value: `${mapDL} `,
                                        },
                                    ])
                                    .setImage(mapPreviewImage);
                                channel.send({
                                    embeds: [embed],
                                });
                            });
                    }, 60000);
                });
            });
    },
};
