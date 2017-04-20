// converts rpms to led values
function convert_rpm_to_led(rpm) {
    var led_num = rpm / 1000
    return Math.floor(led_num);
}

module.exports.convert_rpm_to_led = convert_rpm_to_led;