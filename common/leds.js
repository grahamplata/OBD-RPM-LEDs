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

function simulate_rpm(i) {
  var green = [0, 255, 0];
  var yellow = [255, 255, 0];
  var red = [255, 0, 0];
  var off = [0, 0, 0];

    if (i == 0) {
      set(i, green);
      set(i + 1, off);
      set(i + 2, off);
      set(i + 3, off);
      set(i + 4, off);
      set(i + 5, off);
      set(i + 6, off);
      set(i + 7, off);
    }
    if (i == 1) {
      set(i, green);
    }
    if (i == 2) {
      set(i, green);
    }
    if (i == 3) {
      set(i, green);
    }
    if (i == 4) {
      set(i, yellow);
    }
    if (i == 5) {
      set(i, yellow);
    }
    if (i == 6) {
      set(i, red);
    }
    if (i == 7) {
      set(i, red);
    }
}




module.exports.set = set;
module.exports.setAll = setAll;
module.exports.simulate_rpm = simulate_rpm;
