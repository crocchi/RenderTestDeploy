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
    console.log('a user connected');
  });

console.log('Server is listening on port 8000');
