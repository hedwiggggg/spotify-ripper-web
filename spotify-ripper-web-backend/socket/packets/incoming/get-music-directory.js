const dirTree = require("directory-tree");
const WebSocket = require("ws");

const Packet = require.main.require("./socket/packets/outgoing.js");

module.exports = {
  handle: (ws) => {
    const rippedMusic = dirTree(`/ripped_music`, {
      extensions: /\.(mp3|jpg)$/,
      attributes: ["birthtimeMs"]
    });

    if (ws.readyState === WebSocket.OPEN) {
      const responsePacket = Packet("music-directory", rippedMusic);
      ws.send(responsePacket);
    }
  }
}