var CHANNEL_MULTIPLIER = 0.1;
var BRIGHTNESS = 0.1;
var NUM_LEDS = 8;
var initd = false;

//pushes update to blinkt phat
function update() {
    blinkt.sendUpdate();
}

// set up blinkt with PI GPIO for use with node
function init() {
    var NodeBlinkt = require('node-blinkt');
    blinkt = new NodeBlinkt();
    blinkt.setup();
    blinkt.setAllPixels(0, 0, 0, 1);
    update();
    //set state
    initd = true;
}

//sets all leds on blinkt to same color value
function setAll(rgbArr) {
    for (var i = 0; i < NUM_LEDS; i++) {
        set(i, rgbArr);
    }
}

//set individual pixel
function set(index, rgbArr) {
    if (!initd) init();

    blinkt.setPixel(index,
        rgbArr[0] * CHANNEL_MULTIPLIER,
        rgbArr[1] * CHANNEL_MULTIPLIER,
        rgbArr[2] * CHANNEL_MULTIPLIER,
        BRIGHTNESS);
    update();
}

// Color states
//green functions
function set_green(i) {
    leds.setPixel(i, 0, 156, 0, BRIGHTNESS); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' green');
}

//yellow functions
function set_yellow(i) {
    leds.setPixel(i, 156, 156, 0, BRIGHTNESS); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' yellow');
}

//red functions
function set_red(i) {
    leds.setPixel(i, 156, 0, 0, BRIGHTNESS); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' red');
}

module.exports.set = set;
module.exports.setAll = setAll;
module.exports.set_red = set_red;
module.exports.set_green = set_green;
module.exports.set_yellow = set_yellow;
