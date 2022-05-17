const typeorm = require('typeorm');

const typeormConnection = new typeorm.DataSource({
    type: 'mysql',
    host: process.env.SQL_HOST,
    username: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
    password: process.env.SQL_PW,
    synchronize: true, //disable when in production,
    entities: [], //require('./path/to/entity'), ...
});

module.exports = typeormConnection;
