//USE EXPRESS ...CAUSE IM LAZY
let express = require('express');
let app = express();
const bodyParser = require('body-parser');
//CONF bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
//<%= token %>   <%  if (page == 'home') { %>
// index page
app.get('/', function(req, res) {
  res.render('pages/index',{
    msg:req.rawHeaders
  });
});
//console.log(req.rawHeaders);

app.listen(8000);
console.log('u Server sta ascoltando un pò di music sulla porta: 8000');
