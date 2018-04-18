
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

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

//storage
var data = {
  robots: {
    "Wall_E":[],
    "Baymax":[],
    "NumberSix":[]
  }
};

router.get('/streams/publish', function(req, res){
  //connects to robot and receives robot data
  var WebSocketServer = require('ws').Server;
  var wss = new WebSocketServer({port: 40510});
  wss.on('connection', function (ws) {
    ws.on('message', function (message) {
      console.log('received message: %s', message);
      let currentRobot = JSON.parse(message).robot;
      console.log('robot: ', currentRobot);
      if(data['robots'][currentRobot]){
        data['robots'][currentRobot].push(message);
      }
      console.log(`${currentRobot}'s' data: `, data['robots'][currentRobot]);
    })
  })
  res.json({message: "publish route"});
});

router.get('/streams/subscribe', function(req, res){
  let subscribedRobots = req.query.robots;

  res.json({message: 'subscribe route',
            subscribedTo: subscribedRobots});
});

router.get('/robots/metric/:robot/', function(req, res){
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
