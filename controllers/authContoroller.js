const {promisify}  = require('util');
const AppError = require('./../utils/appError.js');
const jwt = require('jsonwebtoken');
const  db  = require('./../routes/dbRoutes');
const bcrypt = require('bcryptjs');
const { reject } = require('bcrypt/promises');
const cookieparser = require('cookie-parser')
const signToken = async (id)=>{

    return await jwt.sign({id : id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN


})}
const cookieOptions = {
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24 * 60 * 60 * 1000),secure:false,httpOnly:true
}
const crypto = require ('crypto')
const errorHandler = require('./errorController.js');
const { readSync } = require('fs');


const correctPassword = async(userpassword,candidatepassword)=>{

   return await  bcrypt.compare(userpassword,candidatepassword)

}

const changedPasswordAfter = (JWTimestamp,passwordChangedAt)=>{

    if(passwordChangedAt) {

        const changedTimestamp = parseInt(passwordChangedAt.getTime()/1000,10);
        console.log(changedTimestamp,JWTimestamp);
        
    

    return JWTimestamp < changedTimestamp

    }

    return false
}

const createSendToken = async (user,statusCode,res)=>{
    const token = await signToken(user._id);
    res.cookie('jwt',token,cookieOptions)
    user.password = undefined
    user.passwordChangedAt= undefined,
    user.createPasswordResetToken = undefined,
    user.createPasswordResetToken = undefined
    res.status(statusCode).json({
        status:'success',
        token:token,
        data:{
            user
        }
    })
}                                                  



const createPasswordResetToken = async (email) => {

    const resetToken = crypto.randomBytes(32).toString('hex');
     await new Promise(async (resolve,reject)=>{
        db.query(`update users SET passwordResetToken = '${crypto.createHash('sha256').update(resetToken).digest('hex')}' where email='${email}'`,(err,results)=>{
            if(err) reject(err)
            resolve(results)
      })
       }) 
       await new Promise(async (resolve,reject)=>{
       
        
        db.query(`update users SET  passwordResetExpires = ${Date.now() + 10 * 60 * 1000} where email='${email}'`,(err,results)=>{
            if(err) reject(err)
            resolve(results)
      })
       }) 


 

    return resetToken;


}
exports.signup = async (req,res,next)=>{

   let result = await new Promise(async (resolve,reject)=>{
    req.body.password = await bcrypt.hash(req.body.password,12),
    
    db.query('insert into users SET ?',req.body,(err,results)=>{
        if(err) reject(err)
        resolve(results)
  })
   }) 

   createSendToken(req.body,200,res)
   
} 
exports.login = async (req,res,next)=>{
const {email,password} = req.body


 // 1) check if email and password exist

if(!email || !password ){

 return next(new AppError('Please provide email and password!',400))


}
 // 2) check if user exists && password is correct
    const user = await new Promise((resolve,reject)=>{
        db.query(`select * from users where email = '${email}'`,(err,data)=>{
            if(err) reject(err)
            resolve(data)

        })
    })

    const corrpassword = await correctPassword(password,user[0].password);
    

   if(!user[0] || !corrpassword){
        return next(new AppError('Incorrect email or password!',401));

   }  
 // 3) if everything ok , send token to client 
 createSendToken(user[0],200,res)


   
}


exports.logout = async(req,res)=>{

res.cookie('jwt','loggedout',{
    expires: new Date(Date.now()+ 10*1000),
    httpOnly:true
})
res.status(200).json({
    status:"success"
})

}
exports.protect= async (req,res,next)=>{
try{
    //1) getting token
    let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           token = req.headers.authorization.split(" ")[1]
        }

        if(!token){

            return next(new AppError('you are not loggined! please log in to get access!',401))

        }
    //2) validate token
       const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        
   

    //3) check if user still exists

   
    const CurrentUser = await new Promise((resolve,reject)=>{
        
        db.query(`select * from users where _id = '${decoded.id}'`,(err,data)=>{
            if (err) reject(err)

            resolve(data)
        });

    })
  
    if(!CurrentUser[0]){

        return next(new AppError('The user belonging to this token does no longer exist',401));

    }
     
    

    //4) check if user changed password after the jwt was issued

    if(changedPasswordAfter(decoded.iat,CurrentUser[0].passwordChangedAt)){

        return next(new AppError('User recently changed password! Please log in again',401))
    }
    // grant access to protected route 
    req.user = CurrentUser[0];
    next();

}catch(err){

 res.status(401).json({

    status:"fail",
    error:err


 })
}
}

exports.restrictTo = (...roles)=>{

return (req,res,next)=>{

    //roles ['admin','lead-guide']

    if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action',403))

    }
    next()
}}




exports.forgotPassword = async (req,res,next) =>{

    // 1) get user based on Poseted email


    const user = await new Promise((resolve,reject)=>{

        db.query(`select * from users where email = '${req.body.email}'`,(err,data)=>{
            if (err) reject(err)
            resolve(data)
        });
    })
    if(!user[0]){
        return next(new AppError('There is no user with email address',404));
    }
    
    // 2) generate the random reset token

    const resetToken = await createPasswordResetToken(req.body.email)

    //3) send it to user

    res.status(200).json({

        status:'success',
        token:resetToken
    })

}


exports.resetPassword = async (req,res,next)=>{

  // 1) get user based on the token


    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');




    const user = await new Promise((resolve,reject)=>{

        db.query(`select * from users where passwordResetToken = '${hashedToken}' and passwordResetExpires >= ${Date.now()}`,(err,data)=>{
            if (err) reject(err)
            resolve(data)
        });
    })

  //2) if token has not expired and there is user, set the new password
    if(!user[0]){

        return next(new AppError('Token is invalid or has expired!',400))
    }

  //3) update changedpassword at property for the user

   await new Promise((resolve,reject)=>{

    db.query(`update users set password = '${req.body.password}' , passwordResetToken = NULL,passwordResetExpires = NULL  where passwordResetToken = '${hashedToken}' and passwordResetExpires >= ${Date.now()}`,(err,data)=>{
        if (err) reject(err)
        resolve(data)
    });
})
    
  //4 log the user in send jwt 
  
  createSendToken(user[0],200,res)


}

exports.updatePassword = async (req,res,next)=>{

    //1) get user from collection

    
    if(!req.user) {

        return next(new AppError('That user doesn not exist .',404));
}
        


    //2) check if Posted current password is correct
    const corrpassword = await correctPassword(req.body.password,req.user.password);
    
    console.log(corrpassword)
    if(!corrpassword){

        return next(new AppError('current password is not correct',401));

    }

    req.body.newpassword = await bcrypt.hash(req.body.newpassword,12),
    
    //3) if so, update password
    await new Promise((resolve,reject)=>{

        db.query(`update users set password = '${req.body.newpassword}' where email = '${req.user.email}'`,(err,data)=>{
            if (err) reject(err)
            resolve(data)
        });
    })


    //4) log user in, send jwt 

    createSendToken(req.user,200,res)

}

exports.protect= async (req,res,next)=>{
try{
    //1) getting token
    let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           token = req.headers.authorization.split(" ")[1]
        } else if (req.cookies.jwt){
            token = req.cookies.jwt
        
        }

        if(!token){

            return next(new AppError('you are not loggined! please log in to get access!',401))

        }
    //2) validate token
       const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        
      
    //3) check if user still exists

   
    const CurrentUser = await new Promise((resolve,reject)=>{
        
        db.query(`select * from users where _id = '${decoded.id}'`,(err,data)=>{
            if (err) reject(err)

            resolve(data)
        });

    })
   
    if(!CurrentUser[0]){

        return next(new AppError('The user belonging to this token does no longer exist',401));

    }
     

    //4) check if user changed password after the jwt was issued

    if(changedPasswordAfter(decoded.iat,CurrentUser[0].passwordChangedAt)){

        return next(new AppError('User recently changed password! Please log in again',401))
    }
    // grant access to protected route 
    req.user = CurrentUser[0];
    res.locals.user = CurrentUser[0]; 

    next();

}catch(err){

 res.status(401).json({

    status:"fail",
    error:err

 })
}
}

// Only for rendered pages, no errors!


exports.isLoggedIn= async (req,res,next)=>{
    try{
    
        if(Object.keys(req.cookies)[0]){
              
      
           
        //1) verify token
           const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
            
        
    
        //2) check if user still exists
    
       
        const CurrentUser = await new Promise((resolve,reject)=>{
            
            db.query(`select * from users where _id = '${decoded.id}'`,(err,data)=>{
                if (err) reject(err)
    
                resolve(data)
            });
    
        })
       
        if(!CurrentUser[0]){
            

           return next();
    
        }
         
        //3) check if user changed password after the jwt was issued
        
        if(changedPasswordAfter(decoded.iat,CurrentUser[0].passwordChangedAt)){
    
           return next();
        }
        // There is a logged in user
       
        req.user = CurrentUser[0]
        res.locals.user = CurrentUser[0]; 
        
        return next();
            }
            next();
    }catch(err){ 
    
     return next();
    }
    }