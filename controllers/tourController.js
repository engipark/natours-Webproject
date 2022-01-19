const fs = require('fs');
// const Tour = require('./../models/tourModel.js');
const { dbRouter, db } = require('./../routes/dbRoutes');



exports.aliasTopTours = (req,res,next)=>{

req.query.limit = '5'
req.query.sort = '-ratingsAverage,price'
req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
next();
}



exports.getAllTours = (req, res) => {
  let queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'fields','sort'];
  excludedFields.forEach((el) => {
    delete queryObj[el];
  });

  console.log(req.query, queryObj);



  let queryfiltering = (query)=>{
    let filteredquery = query.replace(/{/gi, '');
    filteredquery = filteredquery.replace(/}/gi, '');
    filteredquery = filteredquery.replace(/:/gi, '=');
    filteredquery = filteredquery.replace(/,/gi, ' and ');
    filteredquery = filteredquery.replace(/"/gi, "'");
    filteredquery = filteredquery.replace(/'=/gi, '=');
    filteredquery = filteredquery.replace("'", '');
    filteredquery = filteredquery.replace(/and '/gi, 'and ');
    filteredquery = filteredquery.replace(/=''/gi, '');

    if(Object.keys(queryObj).length) filteredquery = 'where '+filteredquery+' ';

    
    return filteredquery;
  }
  // 1) Filtering
  let queryString = JSON.stringify(queryObj);
  console.log(queryString);
  let filteredquery = queryfiltering(queryString);
 // 2) Sorting

  let Sorting ='';
  if(req.query.sort){

    Sorting = `order by ${req.query.sort}`

  }else{
    Sorting = 'order by id'

  }
  //3) Field limiting
    let fields ;
    if(req.query.fields){
    fields = 'id,'+req.query.fields
  } else{
    fields = '*'
  } 


  //4)  Pagination

  let page = req.query.page*1 || 1;
  let limit = req.query.limit *1 || 100;
  let skip = (page-1)*limit;

  let pagination = ` LIMIT ${skip}, ${limit}`;


  if(req.query.page){

    db.query('select count(*) from tours',(err,numTours)=>{
        console.log(numTours[0]['count(*)']);
        if(err) err;
    try{
        if(skip>= numTours[0]['count(*)']) throw new Error('This page does not exist');

    }catch(error){

    res.status(404).json({
        status:'fail',
        message:error
    })}})}



console.log(fields);
  console.log(filteredquery);
  let sql = `SELECT ${fields} FROM tours ${filteredquery}${Sorting}${pagination}`;
  console.log(sql);
  db.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results,
      },
    });
  });
};

exports.getTour = (req, res) => {
  db.query(`SELECT * from tours where id=${req.params.id}`, (err, result) => {
    if (err) {
      return res.status(404).json({
        status: 'fail',
        message: err,
      });
    }

    res.status(201).json({
      status: 'success',
      result: result.length,
      data: {
        result,
      },
    });
  });
};

exports.createTour = (req, res) => {


  db.query(
    'INSERT INTO tours SET ?',
    {
      name: req.body.name,
      price: req.body.price,
      duration: req.body.duration,
      maxGroupSize: req.body.maxGroupSize,
      difficulty: req.body.difficulty,
      ratingsAverage:
        req.body.ratingsAverage === undefined ? 4.5 : req.body.ratingsAverage,
      ratingsQuantity:
        req.body.ratingsQuantity === undefined ? 0 : req.body.ratingsQuantity,

      priceDiscount: req.body.priceDiscount,
      summary: req.body.summary,
      description: req.body.summary,
      imageCover: req.body.imageCover,

      image1: req.body.image1,
      image2: req.body.image2,
      image3: req.body.image3,

      startDate1: req.body.startDate1,
      startDate2: req.body.startDate2,
      startDate3: req.body.startDate3,

    },
    (err, result) => {
      if (err) {
        res.status(404).json({
          status: 'Invalid data sent!',
          message: err,
        });
      }
      console.log(req.body);
      res.status(202).json({
        status: 'success',
        data: {
          tour: req.body,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  for (let key in req.body) {
    if (key) {
      db.query(
        `UPDATE tours set ${key} = '${req.body[key]}' WHERE id=${req.params.id}`,
        (err, result) => {
          if (err) {
            return res.status(404).json({
              status: 'Invalid data sent!',
              message: err,
            });
          }
          res.status(203).json({
            status: 'success',
            data: {
              result,
            },
          });
        }
      );
    }
  }
};
exports.deleteTour = (req, res) => {
  db.query(`DELETE FROM tours WHERE id=${req.params.id}`, (err, result) => {
    if (err) {
      return res.status(404).json({
        status: 'Invalid data sent!',
        message: err,
      });
    }
    res.status(204).json({
      status: 'success',
      data: result,
    });
  });
};


exports.getTourStats = async (req,res)=>{

  try{
    let result = await new Promise((resolve,reject)=>{
        db.query('SELECT difficulty as difficulty_group ,count(*) as numTours, sum(ratingsQuantity) as numRatings, AVG(ratingsAverage) as avgRating, AVG(price) as avgPrice, min(price) as minPrice, max(price) as maxPrice FROM tours group by difficulty',(err,result)=>{
            if(err) reject(err);
            else resolve(result);
        })})
    if(typeof result == 'ERROR') throw new Error('db 불러오지 못했음')
    console.log(result)
    res.json({
        status: 'success',
        data:{
            stats:result
        }
    })
    
  }catch(err){
    res.status(404).json({
        status: 'fail',
        message: err,
      });
  }
}



// -- 해결못함 어려움 ..// 각 월에 어떤 투어들이 있는지 월별로 그룹화하여 출력해야하는 문제


// exports.getMonthlyplan = async (req,res)=>{

// try{
//   let year = req.params.year*1;

//   res.json({
//     status: 'success',
//     data:{
//         // stats:result
//     }
// })
// }catch(err){


//   res.status(404).json({
//     status:'fail',
//     message:err
//   })


// }

// }