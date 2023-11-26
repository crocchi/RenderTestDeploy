//USE EXPRESS ...CAUSE IM LAZY
let express = require('express');
let app = express();
const bodyParser = require('body-parser');
//CONF bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//DATABASE LOCALE REDIS....mah..proviamo
//let createClient =require('redis');
/*const redis = require("redis");
const client = redis.createClient({
    url:'redis://red-clh44duf27hc739ojkg0:6379'
});
*/

// Connect to your internal Redis instance using the REDIS_URL environment variable
// The REDIS_URL is set to the internal Redis URL e.g. redis://red-343245ndffg023:6379
//const redis = new Redis('redis://red-clh44duf27hc739ojkg0:6379')

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    
   // console.log(req.rawHeaders);
  res.render('pages/index',{
    msg:req.rawHeaders
  });
});


server.listen(8000);

io.on('connection', (socket) => {
    //console.log(socket.handshake.query);
    //console.log('info socketDATA:'+socket.data);
    /*if(socket.handshake.query['login']){ 
        socket.data.username= socket.handshake.query['login'];
    }else
     */
    socket.data.username = (socket.id).slice(1,6);
    
    //set username
    io.emit('setNick', socket.data.username);
    //show logged
    io.emit('chat message', ' join now',socket.data.username,true);

    console.log('User '+socket.data.username+' is connected!');

    socket.on('disconnect', () => {
        console.log('User '+socket.data.username+' is disconnected');
        io.emit('chat message', ' is disconnected',socket.data.username,true);
      });

    socket.on('chat message', (msg) => {
        console.log(socket.data.username+': ' + msg);
        io.emit('chat message', msg,socket.data.username);
      });

  });

console.log('Server is listening on port 8000');
