const typeorm = require('typeorm');

const typeormConnection = new typeorm.DataSource({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    port: process.env.SQL_PORT,
    synchronize: true, //disable when in production,
    entities: [], //require('./path/to/entity'), ...
});

module.exports = typeormConnection;
