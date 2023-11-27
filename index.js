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

//DATABASE MONGODB CLOUD
//DB.JS COLLEGAMENTO AL DB MONGO CLOUD
const db = require('./db/db.js');
// SE CE QLC PROBLEMA A COLLEGARSI AL DB VISUALIZZA ERRORE 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

const ChatMsg = require('./db/chat-model')


io.on('connection', async (socket) => {
    //console.log(socket.handshake.query);
    //console.log('info socketDATA:'+socket.data);
    /*if(socket.handshake.query['login']){ 
        socket.data.username= socket.handshake.query['login'];
    }else
     */
    socket.data.username = (socket.id).slice(1,6);
    
    //READING DATABASE MSG
    let dataTemp=await ChatMsg.find({});
    //send chat record
    io.emit('chatRecord', dataTemp);
    
    //set username
    io.emit('setNick', socket.data.username);
    //show user logged
    io.emit('chat message', ' join now',socket.data.username,true);

    console.log('User '+socket.data.username+' is connected!');

    socket.on('disconnect', () => {
        console.log('User '+socket.data.username+' is disconnected');
        io.emit('chat message', ' is disconnected',socket.data.username,true);
      });

    socket.on('chat message', (msg,time) => {
        console.log(socket.data.username+': ' + msg);
        io.emit('chat message', msg,socket.data.username);
    let msgUpdate = new ChatMsg({
       nick:socket.data.username,
       text:msg
      });
    msgUpdate.save()//.then(() => console.log('meow'));
      });

  });

console.log('Server is listening on port 8000');
