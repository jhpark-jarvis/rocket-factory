import mariadb from 'mariadb';
require('dotenv').config();


const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT;

const pool = mariadb.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
    connectionLimit: 5
});

export default pool;