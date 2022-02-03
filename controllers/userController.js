const AppError = require("../utils/appError");

const db = require(`${__dirname}/../routes/dbRoutes.js`);




exports.getAllUsers = async(req, res) => {
  

  const user = await new Promise((resolve,reject)=>{
    db.query(`select * from users where active = 1`,(err,data)=>{
        if(err) reject(err)
        resolve(data)

    })
})

  res.status(200).json({
    status: 'success',
    results:user.length,
    data:{
      user
    },
  });
};



exports.updateMe = async (req,res,next)=>{

  // 1) Create error if user posts password data

  if(req.body.password){

    return next(new AppError('This route is not for password updates.',400))

  }//2 ) filtered

    delete req.body['role'];
    delete req.body['password'];


  // 3) update user document 

  const user = await new Promise((resolve,reject)=>{
    db.query(`update users set ? where _id = '${req.user._id}' and active = 1 `,req.body,(err,data)=>{
        if(err) reject(err)
        resolve(data)

    })
})
 

  res.status(200).json({

    status:"success",
    data:{

      user

    }
  })


}


exports.deleteMe = async (req,res,next)=>{

  await new Promise((resolve,reject)=>{
    db.query(`update users set active = 0 where _id = '${req.user._id}'`,(err,data)=>{
        if(err) reject(err)
        resolve(data)

    })
})
  res.status(204).json({


    status:'success',
    data:null

  })


}

exports.getUser = async (req, res,next) => {
  const {email} = req.body

  const user = await new Promise((resolve,reject)=>{
    db.query(`select * from users where email = ${email}`,(err,data)=>{
        if(err) reject(err)
        resolve(data)

    })
})

  res.status(200).json({
    status: 'success',
    data:{
      user
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};



