
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var port = process.env.API_PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

router.get('/', function(req, res){
  res.json({message: 'API initialized'})
});

router.get('/streams/publish', function(req, res){
  //turns on websocket connection to robot and retrieves information
  //robot sends its ID
  //server opens websocket connection
  //robot sends its information periodically
  //save in local storage
  res.json({message: 'publish route'});
});

router.get('/streams/subscribe', function(req, res){
  //subscribes to robot
  res.json({message: 'subscribe route'});
});

router.get('/robots/metric/:robot_id/:start-:end', function(req, res){
  //shows robot distance within a certain time interval
  res.json({message: `metric route for robot`,
            robot:req.params.robot_id,
            start:req.params.start,
            end: req.params.end})
});

app.use('/api', router);
app.listen(port, function(){
  console.log(`api running on port ${port}`);
});
