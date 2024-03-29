var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
    name: 'gamebanana_maps',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        modID: {
            type: 'int',
        },
        mapName: {
            type: 'varchar',
        },
        mapAuthor: {
            type: 'varchar',
        },
        dateAdded: {
            type: 'int',
        },
        dateLastUpdated: {
            type: 'int',
        },
    },
});
