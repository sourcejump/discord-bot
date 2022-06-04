var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
    name: 'appeals',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        messageID: {
            type: 'bigint',
        },
        username: {
            type: 'varchar',
        },
        steamID: {
            type: 'varchar',
        },
        reason: {
            type: 'varchar',
            length: 1024,
        },
        discordID: {
            type: 'bigint',
        },
        dateAdded: {
            type: 'bigint',
        },
        dateResolved: {
            type: 'bigint',
            nullable: true,
        },
        resolvedBy: {
            type: 'bigint',
            nullable: true,
        },
        accepted: {
            type: 'bool',
            nullable: true,
        },
    },
});
