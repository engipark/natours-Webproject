const path = require('path');
const fs = require('fs');
const express = require('express');



const morgan = require('morgan');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const xss = require('xss-clean')



// start express application 
const app = express();

app.enable('trust proxy')
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');
const cookieParser = require('cookie-parser');
const compression = require('compression')

//security http headers

app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({extended:true,limit : '10kb'}))

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
 
      baseUri: ["'self'"],
 
      fontSrc: ["'self'", 'https:', 'data:'],
 
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
 
      scriptSrc: ["'self'", 'https://*.stripe.com'],
 
      scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],
 
      frameSrc: ["'self'", 'https://*.stripe.com'],
 
      objectSrc: ["'none'"],
 
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
 
      workerSrc: ["'self'", 'data:', 'blob:'],
 
      childSrc: ["'self'", 'blob:'],
 
      imgSrc: ["'self'", 'data:', 'blob:'],
 
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
 
      upgradeInsecureRequests: [],
    },
  })
);
app.use(compression('*'),cors())
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));

// 1. middleware
app.use(cors());
 
app.options('*',cors()),

// access - control -allow -origin
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const limiter = rateLimit({
max:100,
windowMs: 60 * 60 * 1000,
message:"Too many requests from this IP, please try again in an hour!"
})




app.use(express.json({limit:'10kb'}));

// data sanitization aginst xss 


app.use(xss());



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api',limiter)

// 3. routes 
app.use('/', viewRouter);
app.use('/api/v1/tours', cors(),tourRouter);
app.use('/api/v1/Users', userRouter);
app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
})

app.use(globalErrorHandler)

module.exports = app;
