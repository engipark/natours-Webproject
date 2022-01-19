// connection db
const mysql = require('mysql');



const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const db = mysql.createConnection({
  host: 'dev.com',
  user: 'show',
  password: process.env.DATABASE_PASSWORD,
  database: 'PracticeDb',
});

db.connect((err) => {
  if (err) throw err;

  console.log('Sequel on showdown Connected...');
});

module.exports = db;
 