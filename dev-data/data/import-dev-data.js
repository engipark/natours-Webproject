const fs = require('fs');
// const dotenv = require('dotenv');

// dotenv.config({ path: './config.env' });

const db  = require(`${__dirname}/../../routes/dbRoutes.js`);

// READ JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

``

// import data into db

const importDatat = async () => {
  for (let tour of tours) {
    db.query('INSERT INTO tours SET ?', tour, (err, result) => {
      if (err) return console.log(err);

      console.log('Data successfully added!');
    });
  }
};

const importDatar = async () => {
  for (let review of reviews) {
    db.query('INSERT INTO reviews SET ?', review, (err, result) => {
      if (err) return console.log(err);

      console.log('Data successfully added!');
    });
  }
};

const importDatau = async () => {
  for (let user of users) {
    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) return console.log(err);

      console.log('Data successfully added!');
    });
  }
};
// 그냥 mysql은 promise , async/await 기능 지원안함

const deleteDatat = () => {
  db.query('delete from tours', (err, result) => {
    if (err) return console.log(err);

    console.log('Data successfully deleted!');
  });

  db.query('alter table tours auto_increment=0', (err, result) => {
    if (err) return console.log(err);
    process.exit();
  });
};

const deleteDatau = () => {
  db.query('delete from users', (err, result) => {
    if (err) return console.log(err);

    console.log('Data successfully deleted!');
  });

  db.query('alter table tours auto_increment=0', (err, result) => {
    if (err) return console.log(err);
    process.exit();
  });
};

const deleteDatar = () => {
  db.query('delete from reviews', (err, result) => {
    if (err) return console.log(err);

    console.log('Data successfully deleted!');
  });

  db.query('alter table tours auto_increment=0', (err, result) => {
    if (err) return console.log(err);
    process.exit();
  });
};

if (process.argv[2] === '--importt') importDatat();
if (process.argv[2] === '--importu') importDatau();
if (process.argv[2] === '--importr') importDatar();


if (process.argv[2] === '--deletet') deleteDatat();
if (process.argv[2] === '--deleteu') deleteDatau();
if (process.argv[2] === '--deleter') deleteDatar();

