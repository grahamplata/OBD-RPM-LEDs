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

// Express Server setup
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
console.log('Server listening on port 3000');

// OBDII Calls
if (process.env.NODE_ENV != "development") {

    serialOBDReader.on('dataReceived', function (data) {
        console.log(data);
        dataReceivedMarker = data;
    });

    // On connection begin polling data
    serialOBDReader.on('connected', function (data) {
        this.addPoller("vss");
        this.addPoller("rpm");
        this.addPoller("temp");

        this.startPolling(); // 75ms default polling rate * 3 for each call == .225seconds polling rate
    });

    serialOBDReader.connect();
}

// Socket.IO 
io.on('connection', function (socket) {
    console.log('New client connected!');
    var delayMillis = 100; //1000 = 1 second

    //send data to client
    setInterval(function () {

        // Change values so you can see it go up when developing
        if (process.env.NODE_ENV === "development") {
            if (rpm < 7200) {
                rpm += 11
            } else {
                rpm = 0
            }
        }
    }, delayMillis);
});


// Simulates RPMS on Blink
if (process.env.NODE_ENV === "development") {
    var delayMillis = 50; //1000 = 1 second
    var num = 0; //init number variable
    var rpm = 0; //rpms
    //sets interval at which leds are sequentially lit
    setInterval(function () {
        if (rpm < 7200) {
            Set_LEDS(rpm);
            rpm += 11
            //console.log(rpm);
        } else {
            Set_LEDS(rpm);
            rpm = 0
        }
    }, delayMillis);
}
// converts rpms to led values
function Convert_RPM_to_LED(rpm) {
    var led_num = rpm / 1000
    return Math.round(led_num);
}

// sets leds based on rpms
function Set_LEDS(rpm) {
    var num = Convert_RPM_to_LED(rpm);
    if (num < 8) {
        leds.simulate_rpm(num);
    }
}