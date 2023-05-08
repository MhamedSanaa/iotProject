const SerialPort = require('serialport').SerialPort;
var xbee_api = require("xbee-api");
var request = require("request");
var jsrender = require("jsrender");
var port = "COM3";

const serialport = new SerialPort({path:"COM3",baudRate: 9600});



var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1,
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

xbeeAPI.parser
    .on("data", function (frame) {
        console.log('frame', frame.analogSamples.AD0)
        tempString = frame.analogSamples.AD0.toString()
        temp = parseInt(tempString);


    })
    .on("error", function (err) {
        console.log("error" + err);
    });

serialport.on("error", function (err) {
    console.log("error ----> " + err);
});