// connection db
const mysql = require('mysql');



const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'show',
  password: '8587Rnstnrhk!',
  database: 'NATOURS',
  
});

db.connect((err) => {
  if (err) throw err;

  console.log('Sequel on showdown Connected...');
});





module.exports = db;
 