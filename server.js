const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const PORT = 8001;

server.listen( PORT,() =>{
  console.log(`App is listening on port ${PORT}`)
});