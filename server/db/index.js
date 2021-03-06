const { Pool } = require('pg');

const ConfigService = require('../services/ConfigService');
const logger = require('../log');

const configService = new ConfigService();

const pool = new Pool({
    user: configService.getValue('dbUser'),
    host: configService.getValue('dbHost'),
    database: configService.getValue('dbDatabase'),
    password: configService.getValue('dbPassword'),
    port: configService.getValue('dbPort')
});

module.exports = {
    /**
     * @param {string} text
     * @param {any[]} params
     */
    query: async (text, params = []) => {
        logger.debug(text, params);
        let res = await pool.query(text, params);

        return res.rows;
    },
    queryTran: async (client, text, params = []) => {
        logger.debug(text, params);
        let res = await client.query(text, params);

        return res.rows;
    },
    startTransaction: async () => {
        let client = await pool.connect();
        await client.query('BEGIN');

        return client;
    },
    shutdown: async () => {
        await pool.end();
    }
};
