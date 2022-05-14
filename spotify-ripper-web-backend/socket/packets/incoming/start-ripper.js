const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const Writable = require("stream").Writable;
const WebSocket = require("ws");

const clients = require.main.require("./socket/clients.js");
const Packet = require.main.require("./socket/packets/outgoing.js");

const startContainer = (ws, container) => {
  container.start({}, (err) => {
    if (err) throw err;
    
    startLoggerPipe(ws, container);
    console.log("spotify-ripper container started.", "Container", container.id);

    if (ws.readyState === WebSocket.OPEN) {
      const responsePacket = Packet("container-state", "STARTED");
      ws.send(responsePacket);
    }
  });

  return container;
}

const startLoggerPipe = (ws, container) => {
  container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    stdin: true,
    steam: true,
    tty: true
  }, (err, stream) => {
    if(err) throw err;

    container.logger = new Writable();
    container.logger._write = (doc, encoding, next) => sendLogToWsClient(ws, doc, next);
    
    stream.pipe(container.logger);
    stream.on("end", () => {
      console.log("spotify-ripper container stopped.", "Container", container.id);

      if (ws.readyState === WebSocket.OPEN) {
        const responsePacket = Packet("container-state", "STOPPED");
        ws.send(responsePacket);
      }
      
      clients.add(ws, { container: null });
      clients.delete(ws);

      container.logger.end();
      container.remove();
    });
  });
}

const sendLogToWsClient = (ws, doc, next) => {
  if (ws.readyState === WebSocket.OPEN) {
    const StringDecoder = require("string_decoder").StringDecoder;
    const decoder = new StringDecoder("utf8");
    const result = decoder.write(doc);

    const lines = result.split("\r\n").filter(line => {
      return line ? true : false;
    });

    for (const line of lines) {
      if ((/progress_(total|track)(_remaining)*\((.+?)\)/gm).test(line)) {
        const responsePacket = Packet("progress", line);
        ws.send(responsePacket);
      } else {
        const responsePacket = Packet("terminal", line);
        ws.send(responsePacket);
      }
    }
  }

  next();
}

const baseContainerOptions = {
  Image: "spotify-ripper",
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true
}

module.exports = {
  handle: (ws, packet) => {
    const commands = [
      "spotify-ripper", 
      "--user", 
      packet.data.user, 
      "--password",
      packet.data.pass,
      ...packet.data.uris,
      "--remove-offline-cache"
    ];

    console.log("Trying to download..", "User", packet.data.user);

    const folderName = (new Date().getTime()).toString(36);
    const folderPath = `${process.env.EXPORT_PATH}/${ folderName }`;

    const containerOptions = {
      ...baseContainerOptions,

      Cmd: commands,

      Volumes: {
        "/ripped_music/": {}
      },

      HostConfig: {
        "Binds": [ `${folderPath}:/ripped_music` ],
      }
    };

    docker.createContainer(containerOptions).then((container) => {
      console.log("spotify-ripper container created.", "Container", container.id);
      clients.add(ws, { container: container });

      if (ws.readyState === WebSocket.OPEN) {
        const responsePacket = Packet("download-folder", folderName);
        ws.send(responsePacket);
      }

      return startContainer(ws, container);
    }).catch(function(err) {
      if (err) throw err;
    });
  }
}