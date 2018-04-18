var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var WebSocketServer = require('ws').Server;
var Heap = require('heap');
var port = process.env.API_PORT || 3001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', function(req, res){
  res.json({message: 'API initialized'})
});

//storage
var data = {
  robots: {
    "Wall_E":[],
    "Baymax":[
      {
          timestamp: 0,
          x: 0.0,
          y: 0.0,
          robot: "Baymax"
        },
        {
            timestamp: 1,
            x: 0.1,
            y: 1.3,
            robot: "Baymax"
          },
        {
              timestamp: 2,
              x: 5.0,
              y: 5.0,
              robot: "Baymax"
            }
    ],
    "NumberSix":[
      {
          timestamp: 0,
          x: 0.0,
          y: 0.0,
          robot: "NumberSix"
        },
        {
            timestamp: 8,
            x: 0.1,
            y: 1.3,
            robot: "NumberSix"
          },
        {
              timestamp: 9,
              x: 8.0,
              y: 5.0,
              robot: "NumberSix"
            }
    ]
  }
};


let subscribed = [];


//********************** PUBLISH ENDPOINT *************************************
router.get('/streams/publish', function(req, res){
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
      wss.clients.forEach(function each(client) {
        if(subscribed.includes(currentRobot)){
          client.send(message)
        }
      });
    })

    ws.on('close', function close() {
      console.log('disconnected');
    });
  })
  res.json({message: "Connect to the robots by opening the HTML files in ./test_client"});
});


//********************** SUBSCRIBE ENDPOINT *************************************
router.get('/streams/subscribe', function(req, res){
  subscribed = req.query.robots;
  // var wss_beta = new WebSocketServer({port: 40511});
  // wss_beta.on('connection', function (ws) {
  //   console.log('subscribe server connected');
  //   ws.on('close', function close() {
  //     console.log('disconnected');
  //   });
  // })
  res.json({message: 'subscribe route',
            subscribedTo: subscribed});
});
//********************** METRICS ENDPOINT *************************************
router.get('/robots/metric/:robot/', function(req, res){
  let robot = req.params.robot;
  let robot_data = data['robots'][robot];
  if(!robot_data){
    res.send(`No robots found named ${robot}.  Please check your spelling`);
  }
  let timestamps = robot_data.map(datum => datum.timestamp);
  let min = robot_data.find(datum => datum.timestamp === req.query.start_time || datum.timestamp === Heap.nsmallest(timestamps, 1)[0]);
  let max = robot_data.find(datum => datum.timestamp === req.query.end_time || datum.timestamp === Heap.nlargest(timestamps, 1)[0]);
  if(req.query.start_time > min.timestamp || req.query.start_time > max.timestamp){
    res.send('Invalid request.  Please check your start and end times');
  }
  let distance = Math.hypot(Math.abs(min.x - max.x), Math.abs(min.y-max.y));
  res.json({robot: req.params.robot,
            timeInterval: req.query,
            min: min,
            max: max,
            distanceTraveled: distance
          })
});

app.use('/api', router);
app.listen(port, function(){
  console.log(`api running on port ${port}`);
});
