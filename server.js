//import modules
var OBDReader = require('bluetooth-obd');
var express = require('express');
var path = require('path');
var fs = require('fs');

//Globals
var dataReceivedMarker = {};

// Don't set the bluetooth-obd during development
if (process.env.NODE_ENV != "development") {
    var btOBDReader = new OBDReader();
    //BT - preconfigured
    // Use first device with 'obd' in the name
    btOBDReader.autoconnect('obd');

    btOBDReader.on('connected', function() {
        //this.requestValueByName("vss"); //vss = vehicle speed sensor
        this.addPoller("vss");
        this.addPoller("rpm");

        this.startPolling(1000); //Request all values each second.
    });

    btOBDReader.on('dataReceived', function(data) {
        console.log(data);
        dataReceivedMarker = data;
    });
}



// Express server setup
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(8090);
console.log('Server listening on port 8090');

// Socket.IO part
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('New client connected!');

    //send data to client
    setInterval(function() {

        // Change values so you can see it go up when developing
        if (process.env.NODE_ENV === "development") {
            if (rpm < 7200) {
                rpm += 11
            } else {
                rpm = 0
            }
            if (mph < 120) {
                mph += 1
            } else {
                mph = 0
            }
            if (coolantTemp < 210) {
                coolantTemp += 1
            } else {
                coolantTemp = 0
            }
        }

        socket.emit('ecuData', {
            'rpm': Math.floor(rpm),
            'mph': Math.floor(mph),
            'coolantTemp': Math.floor(coolantTemp)
        });
    }, 100);
});
