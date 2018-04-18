var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var WebSocketServer = require('ws').Server;
var port = process.env.API_PORT || 3001;
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', function(req, res){
  res.json({message: 'API initialized'})
});


//********************** DUMMY DATA *************************************
var DATA = {
  subscribed:[],
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
            timestamp: 5,
            x: 1.0,
            y: 0,
            robot: "Baymax"
          },
        {
              timestamp: 9,
              x: 0,
              y: 0,
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

  myCache.set( "data", DATA, function( err, success ){
  if( !err && success ){
    console.log('initial data saved');
  }
});

//********************** PUBLISH ENDPOINT *************************************
router.get('/streams/publish', function(req, res){
  var wss = new WebSocketServer({port: 40510});
  wss.on('connection', function (ws) {
    ws.on('message', function (message) {
      console.log('received message: %s', message);
      let currentRobot = JSON.parse(message).robot;
      console.log('robot sending data: ', currentRobot);
      let data = myCache.get('data');
      if(data['robots'][currentRobot]){
        data['robots'][currentRobot].push(message);
        if(data['robots'][currentRobot].length >= 3600){
          data['robots'][currentRobot].shift();
        }
      }
      myCache.set('data', data);
      console.log(`${currentRobot}'s' data: `, myCache.get('data')['robots'][currentRobot]);
      wss.clients.forEach(function each(client) {
        if(myCache.get('data').subscribed.includes(currentRobot)){
          client.send(message)
        }
      });
    })

    ws.on('close', function close() {
      console.log('disconnected');
    });
  })
  res.json({message: "Connect to the robots by opening the HTML files in ./test_client/robots"});
});


//********************** SUBSCRIBE ENDPOINT *************************************
router.get('/streams/subscribe', function(req, res){
  let data = myCache.get('data');
  data.subscribed = req.query.robots;
  myCache.set('data', data);
  res.json({message: 'subscribe route',
            subscribedTo: myCache.get('data').subscribed});
});


//********************** METRICS ENDPOINT *************************************
router.get('/robots/metric/:robot/', function(req, res){
  let robot = req.params.robot;
  let robot_data = myCache.get('data')['robots'][robot];
  if(!robot_data){
    res.send(`No robots found named ${robot}.  Please check your spelling`);
  }
  if(req.query.start_time - req.query.end_time > 36000 || req.query.end_time < req.query.start_time){
    res.send('Please select a valid time interval.  Time intervals should be less than 1 hour (3600 seconds).  Start time must be smaller than end time');
  }
  let totalDistance = 0;
  let previousDatum;
  robot_data.forEach(datum =>{
    if(datum.timestamp >= req.query.start_time && datum.timestamp <= req.query.end_time){
      if(previousDatum){
        totalDistance += Math.hypot(Math.abs(datum.x - previousDatum.x), Math.abs(datum.y-previousDatum.y));
      }
      previousDatum = datum;
    }
  });

  res.json({robot: req.params.robot,
            timeInterval: req.query,
            distanceTraveled: totalDistance
          })
});

app.use('/api', router);
app.listen(port, function(){
  console.log(`api running on port ${port}`);
});
