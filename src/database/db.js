const typeorm = require('typeorm');

const typeormConnection = new typeorm.DataSource({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    synchronize: true, //disable when in production,
    entities: [
        require('./entity/gamebanana_maps'),
        require('./entity/appeals'),
    ], //require('./path/to/entity'), ...
});

module.exports = typeormConnection;
