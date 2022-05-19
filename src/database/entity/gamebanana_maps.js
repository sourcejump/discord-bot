var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
    name: 'gamebanana_maps', // Will use table name `category` as default behaviour.
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
