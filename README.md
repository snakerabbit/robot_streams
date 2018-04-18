# Robot Streams App

## About The App:
The Robot Streams App is an API that utilizes web sockets to stream data from active robots, and to send data to clients.

## Technologies Used:
* Express.JS - backend
* WebSocket - realtime data streaming
* Node-Cache - data cache

## Get Started:
* Download the project folder and `cd robot_streams-master` in the Mac Terminal to enter project folder.

* Run `npm install` to install dependencies.

* Run `node server.js` to run the server.

* Go to http://localhost:3001/api/ in your browser.  You should see this success message:
![alt text](https://image.ibb.co/jgXW97/Screen_Shot_2018_04_18_at_2_00_39_AM.png "API Initialized")

## API Endpoints:
### /api/streams/publish/
Purpose: saves any data streaming from the active robots.  

How to Use:
* Go to http://localhost:3001/api/streams/publish in browser.
* Open any of the html files in the test_client/robots folder to activate the robot.  Please reference the Meet The Robots section to learn more about each robot.
* Watch Mac Terminal running node to see the streaming data in real time.
![alt text](https://image.ibb.co/g0yhGn/Screen_Shot_2018_04_18_at_2_28_03_AM.png "publish")


Features:
* utilizes Node-Cache to save data collected from robots.
* determines which robot is streaming data, and saves to cache accordingly


### /api/streams/subscribe/
Purpose: allows clients to subscribe to any robot's streaming data and receive it in real time.

How To Use:
* Reference the Meet The Robots section to reference existing robots and their names.
* Go to http://localhost:3001/api/streams/subscribe/{querystring}.  The query string should include the robots that you want to subscribe to.
* Example URL: http://localhost:3001/api/streams/subscribe/?robots=Baymax&robots=Wall_E
* Make sure that /api/streams/publish endpoint as well as the robot html file you subscribed to is open and thus is streaming data.
* Open `client.html` to receive the streams.
* `option + command + i` to open Chrome Console in browser.
* Watch the streaming data come in on the Chrome Console:
![alt text]( https://image.ibb.co/fJRY6n/Screen_Shot_2018_04_18_at_2_45_42_AM.png "publish")

Features:
* receives multiple robots' streaming data in real time

### api/robots/metric/{robot}/
Purpose: provides the absolute Euclidean distance any robot has traveled.

How To Use:
* Reference the Meet The Robots section to reference existing robots and their names.
* Go to http://localhost:3001/api/robots/metric/{robot}/{querystring}.  The robot should match the robot's name.  The query string should include a start_time and end_time in Unix seconds.
* Example URL: http://localhost:3001/api/robots/metric/Baymax/?start_time=1&end_time=10
* The distance is returned to the browser in JSON format:
![alt text]( https://image.ibb.co/mpSnz7/Screen_Shot_2018_04_18_at_2_57_52_AM.png "publish")

Features:
* The total distance is calculated using Euclidean distance.

![alt text]( https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Euclidean_distance_2d.svg/220px-Euclidean_distance_2d.svg.png "publish")
* (Reference: Wikipedia)

* The distance was calculated in O(n) time for speed, which is of major importance due to the robots streaming in 10 Hz.
  ```javascript
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
  ```

## Meet The Robots:
### Baymax
![](https://static-s.aa-cdn.net/img/amazon/30600000409146/d443e6cb39a1beadaa64434cd4abbf6c?v=1)
* Name: "Baymax"
* Location: './test_client/robots/baymax.html'
* Reference: Disney Pixar's Big Hero Six

### Wall_E
![](https://cdn2.iconfinder.com/data/icons/walle/256/my_computer.png)
* Name: "Wall_E"
* Location: './test_client/robots/wall_e.html'
* Reference: Disney Pixar's Wall-E

### Number Six
![](https://orig00.deviantart.net/cfe2/f/2011/351/f/7/battlestar_galactica_by_pjmorris-d4jf1jv.png)
* Name: "NumberSix"
* Location: './test_client/robots/numbersix.html'
* Reference: Battlestar Galactica (2004)
