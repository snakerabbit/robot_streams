
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

router.get('/streams/publish', function(req, res){
  res.json({message: 'publish route'});
});

router.get('/streams/subscribe', function(req, res){
  res.json({message: 'subscribe route'});
});

router.get('/robots/metric/:robot_id', function(req, res){
  res.json({message: `metric route for robot: ${req.params.robot_id}`})
});

app.use('/api', router);
app.listen(port, function(){
  console.log(`api running on port ${port}`);
});
