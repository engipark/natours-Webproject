const sendErrorDev = (err,req,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.statusCode,
            error:err,
            message:err.message,
            stack:err.stack
          })
} else{

}
}

const sendErrorPro = (err,res)=>{


    if(err.isOperational){
    res.status(err.statusCode).json({ 
        status:err.status,    
        message:err.message,
      })
    }else{
        res.status(500).json({ 
            status:'error',    
            message:'Something went very wrong!'
          })


    }
}





module.exports = (err,req,res,next)=>{

    console.log(err.stack)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err,res)

    }else if(process.env.NODE_ENV === ' production'){

        sendErrorPro(err,res)
    
    }
  }