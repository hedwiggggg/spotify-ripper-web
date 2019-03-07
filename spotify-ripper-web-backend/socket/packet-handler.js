const startRipperPacket = require("./packets/incoming/start-ripper.js");
const stopRipperPacket = require("./packets/incoming/stop-ripper.js");
const getMusicDirectory = require("./packets/incoming/get-music-directory.js");

module.exports = {
  handle: function(ws, jsonPacket) {
    const parsedPacket = JSON.parse(jsonPacket);

    console.log("Incoming packet ## " + parsedPacket.id);

    switch (parsedPacket.id) {
      case "start-ripper":
        startRipperPacket.handle(ws, parsedPacket);
        break;

      case "stop-ripper":
        stopRipperPacket.handle(ws, parsedPacket);
        break;

      case "get-music-directory":
        getMusicDirectory.handle(ws, parsedPacket);
        break;
    
      default:
        console.log("Packet not found! ## ", parsedPacket.id);
        break;
    }
  }
}