//USE EXPRESS ...CAUSE IM LAZY
let express = require('express');
let app = express();
const PORT = 8000
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
app.get('/', function (req, res) {

  // console.log(req.rawHeaders);
  res.render('pages/index', {
    msg: req.rawHeaders
  });
});

// index page
app.get('/game', function (req, res) {

  // console.log(req.rawHeaders);
  res.render('pages/game', {
    msg: req.rawHeaders
  });
});


server.listen(PORT);

const ChatMsg = require('./db/chat-model')

let numberPlayer = [];
let numberPlayerChan = [];

io.on('connection', async (socket) => {
  //console.log(socket.handshake.query);
  //console.log('info socketDATA:'+socket.data);
  /*if(socket.handshake.query['login']){ 
      socket.data.username= socket.handshake.query['login'];
  }else
   */
  socket.data.username = (socket.id).slice(1, 6);

  //READING DATABASE MSG
  let dataTemp = await ChatMsg.find({});
  //send chat record
  io.to(socket.id).emit('chatRecord', dataTemp);

  //set username
  io.to(socket.id).emit('setNick', socket.data.username);
  //show user logged
  io.emit('chat message', ' join now', socket.data.username, true);

  console.log('User ' + socket.data.username + ' is connected!');

  socket.on('disconnect', () => {
    console.log('User ' + socket.data.username + ' is disconnected');
    io.emit('chat message', ' is disconnected', socket.data.username, true);
  });

  socket.on('chat message', (msg, time) => {
    console.log(socket.data.username + ': ' + msg + " (" + time + ")");
    io.emit('chat message', msg, socket.data.username, false, time);
    let msgUpdate = new ChatMsg({
      nick: socket.data.username,
      text: msg,
      data: time
    });
    msgUpdate.save()//.then(() => console.log('meow'));
  });

  //

  socket.on('game start', (liv, num) => {

    //CREAZIONE NUMERI CASUALI
    //numeri probabili che possono uscire da 1-10
    let numeri = 10;

    //quantità di numeri
    let qnt = num//20;

    let numberData = [];

    //CREA UN CANALE PER L'UTENTE..COSì DA POTERGLI INVIARE DATI SOLO A LUI
    socket.join(socket.id);//crea un canale con il nome identificativo dell'utente

    //RIEMPI ARRAY CON CICLO CON I NUMERI CASUALI 
    for (let i = 0; i < qnt; i++) {
      numberData.push(Math.floor(Math.random() * numeri));
    }
    //INVIA DATI AL CANALE APPENA APERTO X UTENTE, 2 callback metti tipo del gioco
    io.to(socket.id).emit("gameSet", numberData, "campain");
    //io.emit('gameSet', numberData);

  })


  socket.on('gameOnline 1vs1', async (liv, num) => {

    //CREAZIONE CANALE PER IL  1 vs 1
    //socket.join(s); 
    //socket.join(socket.id);

    if (numberPlayer[0] === socket.data.username) {  //CONTROLLA IL PRIMO UTENTE SE è LO STESSO DEL SECONDO
      io.to(socket.id).emit('gameSet', "Non puoi giocare contro te stesso..è buttonGame... nn una sega.");
      return
    }//PLAYER GIà ISCRITTO FORSE CLIKKI DUE VOLTE X ERRORE
    //socket.data.username;
    numberPlayer.push(socket.data.username);
    console.log(numberPlayer);
    if (numberPlayer.length >= 2) {// SE CI SONO DUE PLAYER NELL'ARRAY DI ATTESA
      //FAI ENTRARE UTENTE SECONDO NEL CANALE DEL 1vs1
      socket.join(numberPlayer[0]);
      //manda msg a quelli del canale
      io.to(numberPlayer[0]).emit('gameSet', "trovati i player x la partita.. [" + numberPlayer + "]");
      numberPlayer = [];
      //QUI INVIAMO DATI X INIZIARE IL GIOCO 1vs1
      // dp...MO FACCIO PRIMA LE BOLLE ..UHIUUGYFT


    } else { //SE è IL PRIMO PLAYER IN ASCOLTO PER LA PARTITA

      io.to(socket.id).emit('gameSet', "sei in attesa x la partita...\n" + socket.data.username);
      //APRI UN CANALE PER IL 1vs1
      socket.join(socket.data.username);

      // io.emit('gameSet', "sei in attesa x la partita...\n"+socket.data.username); 
    }



  })





});

console.log(`Server is listening on port ${PORT}`);
