const tourSchema =
  'create table tours(name varchar(255) not null unique,duration float not null,maxGroupSize float not null,difficulty varchar(10) not null,ratingsAverage float default 4.5,ratingsQuantity float default 0, price float not null, priceDiscount float ,summary varchar(255) not null ,description varchar(255) ,imageCover varchar(255) not null,images varchar(255),createdAt Datetime default now(),startDates varchar(255))';

module.exports = tourSchema;
