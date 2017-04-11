//import modules
var OBDReader = require('bluetooth-obd');
var express = require('express');
var path = require('path');
var fs = require('fs');

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

var io = require('socket.io')(server);

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
