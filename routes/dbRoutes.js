// connection db
const mysql = require('mysql');



const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const db = mysql.createConnection({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'beb273d2c5825d',
  password: '8587Rnstnrhk!',
  database: 'heroku_fe0940fd07c984c',
  
});

db.connect((err) => {
  if (err) throw err;

  console.log('Sequel on showdown Connected...');
});





module.exports = db;
 