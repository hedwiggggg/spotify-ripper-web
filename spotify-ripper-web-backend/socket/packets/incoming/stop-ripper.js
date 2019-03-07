const clients = require.main.require("./socket/clients.js");

module.exports = {
  handle: (ws) => {
    if (clients.get(ws) && clients.get(ws).container !== null) {
      clients.get(ws).container.stop();
    }
  }
}