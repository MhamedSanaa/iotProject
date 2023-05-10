const SerialPort = require("serialport").SerialPort;
const axios = require("axios");
const admin = require("firebase-admin");
const serviceAccount = require("./zigbee-3143e-firebase-adminsdk-41isy-dfaa4b1663.json");
var xbee_api = require("xbee-api");
var request = require("request");
var jsrender = require("jsrender");

var port = "COM4";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zigbee-3143e-default-rtdb.firebaseio.com/",
});

const database = admin.database();

const serialport = new SerialPort({ path: "COM4", baudRate: 9600 });

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1,
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

xbeeAPI.parser
  .on("data", function (frame) {
    console.log("frame", frame.analogSamples.AD0);

    tempString = frame.analogSamples.AD0.toString();
    temp = parseInt(tempString) * 0.03662109375;

    // sending to the web version
    axios.post("https://api.thingspeak.com/update.json", {
      channel_id: 2140743,
      field1: temp,
      api_key: "NK0YWP8IIGT0A2D6",
    });

    const time = Date.now();
    database.ref("temperatures").push({ temp, time }, (error) => {
      if (error) {
        console.error("Error saving data:", error);
      } else {
        console.log(`Temperature ${temp} saved at ${time}`);
      }
    });
  })
  .on("error", function (err) {
    console.log("error" + err);
  });

serialport.on("error", function (err) {
  console.log("error ----> " + err);
});
