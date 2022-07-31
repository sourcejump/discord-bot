var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
    name: 'configuration',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            unique: true,
        },
        value: {
            type: 'varchar',
            nullable: true,
        },
    },
});
