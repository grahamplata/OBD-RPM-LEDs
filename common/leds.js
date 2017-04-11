function init() {
    leds.setup();
    leds.clearAll();
    leds.sendUpdate();
    console.log('Blinkt has been cleared');
}

function show_rpm() {
    var i = 0;
    while (i < 8) {
        if (i < 4) {
            set_green(i);
        }
        if (i == 4 || i == 5) {
            set_yellow(i);
        }
        if (i == 6 || i == 7) {
            set_red(i);
        }
        i++;
    }
}

//green functions
function set_green(i) {
    leds.setPixel(i, 0, 156, 0, 0.1); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' green');
}

//yellow functions
function set_yellow(i) {
    leds.setPixel(i, 156, 156, 0, 0.1); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' yellow');
}

//red functions
function set_red(i) {
    leds.setPixel(i, 156, 0, 0, 0.1); //position, r, g, b, brightness
    leds.sendUpdate();
    console.log('set pixel ' + i + ' red');
}

init();
show_rpm();
