//import node modules
var OBDReader = require('bluetooth-obd');
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io')(server);

//import local modules
var leds = require('./common/leds.js');
var delayMillis = 100; //1 second


function simulate_rpm(i) {
  var green = [0, 255, 0];
  var yellow = [255, 255, 0];
  var red = [255, 0, 0];
  var off = [0, 0, 0];

    if (i == 0) {
      leds.set(i, green);
      leds.set(i + 1, off);
      leds.set(i + 2, off);
      leds.set(i + 3, off);
      leds.set(i + 4, off);
      leds.set(i + 5, off);
      leds.set(i + 6, off);
      leds.set(i + 7, off);
    }
    if (i == 1) {
      leds.set(i, green);
    }
    if (i == 2) {
      leds.set(i, green);
    }
    if (i == 3) {
      leds.set(i, green);
    }
    if (i == 4) {
      leds.set(i, yellow);
    }
    if (i == 5) {
      leds.set(i, yellow);
    }
    if (i == 6) {
      leds.set(i, red);
    }
    if (i == 7) {
      leds.set(i, red);
    }
}

var num = 0;
setInterval(function() {
    if (process.env.NODE_ENV === "development") {

        if (num < 8) {
            simulate_rpm(num);
            console.log('pixel: ' + num + ' set');
            num += 1
        } else {
            num = 0
        }
    }
}, delayMillis);

//Globals
var dataReceivedMarker = {};

//
//
// OBD connection setup //
//
//

// Don't set the bluetooth-obd during development
if (process.env.NODE_ENV != "development") {
    var btOBDReader = new OBDReader();
    //BT - preconfigured
    // Use first device with 'obd' in the name
    btOBDReader.autoconnect('obd');

    //set polling for vehicle speed and engine RPM
    btOBDReader.on('connected', function() {
        this.addPoller("vss");
        this.addPoller("rpm");
        this.startPolling(1000); //Request all values each second.
    });

    btOBDReader.on('dataReceived', function(data) {
        console.log(data);
        dataReceivedMarker = data;
    });

    btOBDReader.on('error', function(data) {
        console.log('Error: ' + data);
    });

    btOBDReader.on('debug', function(data) {
        console.log('Debug: ' + data.body);
    });
}

//
//
// Express server setup //
//
//

var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
console.log('Server listening on port 3000');
console.log('Data Recieved Marker: ' + JSON.stringify(dataReceivedMarker, null, 2));

//
//
// Socket io setup //
//
//

io.on('connection', function(socket) {
    console.log('New client connected!');

    //send data to client
    setInterval(function() {
        // Change values so you can see it go up when developing
        if (process.env.NODE_ENV === "development") {
            if (dataReceivedMarker.rpm < 7200) {
                dataReceivedMarker.rpm += 11
            } else {
                dataReceivedMarker.rpm = 0
            }
            if (dataReceivedMarker.mph < 120) {
                dataReceivedMarker.mph += 1
            } else {
                dataReceivedMarker.mph = 0
            }
        }

        socket.emit('ecuData', {
            'rpm': Math.floor(rpm),
            'mph': Math.floor(mph)
        });
    }, 100);
});
