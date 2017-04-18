//import node modules
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io')(server);
var OBDReader = require('serial-obd');

//import common modules
var leds = require('./common/leds.js');

//configurations for serial over bluetooth
var options = {};
options.baudrate = 115200;
var serialOBDReader = new OBDReader("/dev/rfcomm0", options);
var dataReceivedMarker = {};


// OBD connection setup
// Don't set the bluetooth-obd during development
if (process.env.NODE_ENV != "development") {

    serialOBDReader.on('dataReceived', function (data) {
        console.log(data);
        dataReceivedMarker = data;
    });

    serialOBDReader.on('connected', function (data) {
        this.addPoller("vss");
        this.addPoller("rpm");
        this.addPoller("temp");

        this.startPolling(); // 75 * 3 == .225seconds polling rate
    });

    serialOBDReader.connect();
}

// Simulates RPMS on Blink
if (process.env.NODE_ENV === "development") {
    var delayMillis = 50; //1000 = 1 second
    var num = 0; //init number variable

    //sets interval at which leds are sequentially lit
    setInterval(function () {
        if (num < 8) {
            leds.simulate_rpm(num);
            //console.log('pixel: ' + num + ' set');
            num += 1
        } else {
            num = 0 //reset loop
        }
    }, delayMillis); //set delay
}


// Express
// Server setup
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
console.log('Server listening on port 3000');