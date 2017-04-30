//import node modules
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io')(server);
var OBDReader = require('serial-obd');

//import common modules
var leds = require('./common/leds.js');
var rotation = require('./common/rpms.js');

//configurations for serial over bluetooth
var options = {};
options.baudrate = 115200;
var serialOBDReader = new OBDReader("/dev/rfcomm0", options);


// All the values we are getting from the OBD port
var dataReceivedMarker = {}; // Object returned by OBDII
var rpm = 0;
var mph = 0;
var coolantTemp = 0; // defaults 

// Express Server setup
var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));
var server = app.listen(3000);
console.log('Server listening on port 3000');


// OBDII Calls
if (process.env.NODE_ENV != "development") {

    // initiates connection to obd
    serialOBDReader.connect();

    // On connection begin polling data
    serialOBDReader.on('connected', function (data) {
        this.addPoller("rpm");
        this.startPolling(50); // 75ms default polling rate * 3 for each call == .225seconds polling rate
    });

    serialOBDReader.on('dataReceived', function (data) {
        newData = Math.floor(data.value);
        Set_LEDS(newData); // Sets LEDS based on OBDII data
        console.log(newData); //debug
    });
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
            if (vss < 200) {
                vss += 7
            } else {
                vss = 0
            }
            if (temp < 300) {
                temp += 3
            } else {
                temp = 0
            }
        }

        // define event and emit data
        socket.emit('obdData', {
            'rpm': Math.floor(rpm),
            'vss': Math.floor(mph),
            'temp': Math.floor(coolantTemp)
        });

    }, delayMillis);
});

// Simulates RPMS on Blink
if (process.env.NODE_ENV === "development") {
    var delayMillis = 50; //1000 = 1 second
    var num = 0; //init number variable
    var simRPM = 0;
    //sets interval at which leds are sequentially lit
    setInterval(function () {

        if (simRPM < 7200) {
            simRPM += 50
            Set_LEDS(simRPM);
        } else {
            simRPM = 0
            Set_LEDS(simRPM);
        }
    }, delayMillis);
}

// sets leds based on rpms
function Set_LEDS(rpm) {
    var num = rotation.convert_rpm_to_led(rpm);
    if (num < 8) {
        leds.simulate_rpm(num);
    }
}
