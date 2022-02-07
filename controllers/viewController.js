const AppError = require('../utils/appError');
const db = require('./../routes/dbRoutes')


exports.getOverview = async(req,res,next)=>{

    //1) Get tour data from collection

    const tours = await new Promise((resolve,reject)=>{

        db.query('select * from tours',(err,data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })

  
    // 2) Build template
    // 3) Render that template using tour data from 1)
   
    res.status(200).render('overview',{
      title: 'All Tours', 
      tours: tours
    });
  
  }   
exports.getTour = async (req,res)=>{
  let slug = req.params.slug.replace(/-/g,' ')
  const tour = await new Promise((resolve,reject)=>{
    db.query(`select *,tours.name as name ,users.name as user_name from tours join reviews on tours.id = reviews.tour join users on reviews.user = users._id  where tours.name = '${slug}' `,(err,data)=>{
      if(err) reject(err);
      resolve(data);
    })
  })
  if(!tour[0]){

    res.status(404).render('error',{

      title:'Something went wrong!',
      msg: "this tour doesn't exist!!!!!!!!!!!!!!!!!!!!!!!!!!!"



  })

  return 0
  }
 
  const users = await new Promise((resolve,reject)=>{
    db.query('select * from users',(err,data)=>{
      if(err) reject(err);
      resolve(data);
    })
  })


  const reviews = await new Promise((resolve,reject)=>{
    db.query('select * from reviews',(err,data)=>{
      if(err) reject(err);
      resolve(data);
    })
  })

  
  
    // console.log(tour)
    // console.log(users)
    console.log(tour[0].guide.split(',')[0])
    // console.log(users.filter((value)=> value['_id'] == tour[0].guide.split(',')[0])[0].photo)

    res.status(200).render('tour',{
      title: `${tour[0].name}`,
      users:users,
      reviews:reviews,
      tour:tour
    });
  
  }



  exports.getLogin = (req,res)=>{

    res.status(200).render('login',{



      title: 'Log into your account'
    });



  }



exports.getAccount = (req,res)=>{


  
res.status(200).render('account',{
  title:"your account!",

})
}

exports.updateUser = async (req,res,next)=>{
  
const user = req.user._id

 await new Promise((resolve,reject)=>{
 db.query(`update users set ? where _id = '${user}'`,req.body,(err,data)=>{
    if(err) reject(err)
   resolve(data)
  })
})
const updatedUser = await new Promise((resolve,reject)=>{

  db.query(`select * from users users where _id = '${user}'`,(err,data)=>{
     if(err) reject(err)
    resolve(data)
   })
 }) 
 await res.status(200).render('account',{
  title:"your account",
  user:updatedUser[0]
})
}

