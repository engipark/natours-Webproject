// connection db
const mysql = require('mysql');



const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const db = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "beb273d2c5825d",
  password: "1db2fbce",
  database: "heroku_fe0940fd07c984c",
  
});

db.connect((err) => {
  if (err) throw err;

  console.log('Sequel on showdown Connected...');
});



setInterval(function () {
  db.query('SELECT 1');
}, 5000);

module.exports = db;
 