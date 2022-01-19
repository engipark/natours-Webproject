
const db = require(`${__dirname}/../routes/dbRoutes.js`);




exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
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

exports.loginCheck = async (req,res)=>{
  
  let qq = await new Promise((resolve,reject)=>{
    db.query(`select * from users where email= '${req.body.email}'`,(err,data)=>{
      if(err) reject(err);
      resolve(data);
    });

  })

  if(qq[0]){

  res.status(200).json({

    status:'Success',
    data:qq

  })
  }
  else{
    console.log('아이디 비밀번호 오류')
    res.status(404).json({
      status:'fail',
      message:'아이디 비밀번호 오류'  
  })}



  
}
