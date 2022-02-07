const app = require('./app');

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('App running on port 3000!....');
});


process.on('SIGTERM',()=>{

  console.log('SIGTERM RECEIVED. shutting down gracefully')
  server.close(()=>{

    console.log('Process terminated!');

  })

})