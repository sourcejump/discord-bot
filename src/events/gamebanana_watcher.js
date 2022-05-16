const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    execute: async (client) => {
        //Switch to a database in the future?
        let Maps = [];
        const cssUrl =
            'https://gamebanana.com/apiv8/Mod/ByCategory?_csvProperties=_idRow,_tsDateAdded,_tsDateUpdated,_sName,_aSubmitter&_aCategoryRowIds%5B%5D=5568&_sOrderBy=_tsDateAdded,DESC&_nPerpage=10';
        const csgoUrl =
            'https://gamebanana.com/apiv8/Mod/ByCategory?_csvProperties=_idRow,_tsDateAdded,_tsDateUpdated,_sName,_aSubmitter&_aCategoryRowIds%5B%5D=5422&_sOrderBy=_tsDateAdded,DESC&_nPerpage=10';
        let guild = client.guilds.resolve(process.env.GUILD_ID);
        guild.channels
            .fetch(process.env.NEW_MAPS_CHANNEL_ID)
            .then((GuildChannel) => {
                GuildChannel.fetch().then((channel) => {
                    const handleData = async (css, res) => {
                        let modID = res[0]['_idRow'];

                        let mapPreviewImage = `https://gamebanana.com/mods/embeddables/${modID}?type=large`;
                        let mapName = res[0]['_sName'];
                        let mapAuthor = res[0]['_aSubmitter']['_sName'];
                        let mapDL = `https://gamebanana.com/mods/${modID}`;
                        let updated = false;

                        if (Maps.find((x) => x.modID == modID)) {
                            // If the map has not changed since last time we checked it.
                            if (
                                res[0]['_tsDateUpdated'] ==
                                Maps.find((x) => x.modID == modID)
                                    .dateLastUpdated
                            )
                                return;
                            else updated = true;
                        }
                        // Add the new map object to the array to prevent duplicate messages.
                        Maps.push({
                            modID: modID,
                            dateAdded: res[0]['_tsDateAdded'],
                            dateLastUpdated: res[0]['_tsDateUpdated'],
                        });

                        const embed = new MessageEmbed()
                            .setTitle(
                                updated
                                    ? css
                                        ? 'CS:S - Map Updated'
                                        : 'CS:GO - Map Updated'
                                    : css
                                    ? 'CS:S - New Map'
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
                    };
                    setInterval(async () => {
                        fetch(cssUrl)
                            .then((data) => data.json())
                            .then((body) => {
                                handleData(true, body);
                            });
                        fetch(csgoUrl)
                            .then((data) => data.json())
                            .then((body) => {
                                handleData(false, body);
                            });
                    }, 60000);
                });
            });
    },
};
