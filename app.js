const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const { router, db } = require('./routes/dbRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');
app.set('view engine','pug');

app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));

// 1. middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3. routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/Users', userRouter);

module.exports = app;
