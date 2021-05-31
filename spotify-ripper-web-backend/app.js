const express = require("express");
const app = express();

const WebSocket = require("ws");

const dirTree = require("directory-tree");
const rimraf = require("rimraf");

const Writable = require("stream").Writable;

const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const clients = require("./socket/clients.js");
const packetHandler = require("./socket/packet-handler.js");

const buildImage = new Promise((resolve, reject) => {
  const logger = new Writable();

  logger._write = function write(doc, encoding, next) {
    try {
      const StringDecoder = require("string_decoder").StringDecoder;
      const decoder = new StringDecoder("utf8");
      const result = decoder.write(doc);
      const parsedResult = JSON.parse(result);
      const streamData = parsedResult.stream || "";
  
      const lines = streamData
        .split("\n")
        .filter(line => {
          return line ? true : false;
        });
  
      for (const line of lines) {
        console.log(line);
      }
    } catch (error) {
      // console.error(error);
    } finally {
      next();
    }
  };

  const context = process.cwd() + "/../spotify-ripper-docker";
  const src = ["Dockerfile", "config.ini", "spotify_appkey.key", "dependencies"];

  docker.buildImage(
    { context, src },
    { t: "spotify-ripper" },

    function(err, stream) {
      if (err) reject(err);

      stream.pipe(logger);
      stream.on("end", function() {
        logger.end();
        resolve();
      });
    }
  );
});

const startWebServer = (
  new Promise((resolve, reject) => {
    try {
      app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      
      app.use("/web", express.static(process.cwd() + "/../spotify-ripper-web-frontend/dist"));
      app.use("/music", express.static(process.cwd() + "/../ripped_music"));
  
      app.listen(3000, "0.0.0.0", function () {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  })
);

const startWebSocketServer = (
  new Promise((resolve, reject) => {
    try {
      const wss = new WebSocket.Server({ host: "0.0.0.0", port: 3300 });
  
      wss.on("connection", (ws) => {
        clients.add(ws, { container: null });
        console.log("Client connected to the Server.");
  
        const rippedMusic = dirTree(`/ripped_music`, {
          extensions: /\.(mp3|jpg)$/,
          attributes: ["birthtimeMs"]
        });
  
        const sessionFolders = rippedMusic.children;
        const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
        const NOW_IN_MS = new Date().getTime();
  
        for (const folder of sessionFolders) {
          const deltaCreation = NOW_IN_MS - folder.birthtimeMs;
  
          if (deltaCreation >= TWENTY_FOUR_HOURS_IN_MS) {
            rimraf(folder.path, () => { console.log(`Successfully deleted ${ folder.path }`); });
          }
        }
        
        ws.on("message", (packet) => {
          packetHandler.handle(ws, packet);
        });
  
        ws.on("close", () => {        
          console.log("Client disconnected from the Server.");
  
          if (clients.get(ws) && clients.get(ws).container !== null) {
            clients.get(ws).container.stop();
          }
        })
      });
  
      resolve();
    } catch (error) {
      reject(error);
    }
  })
);

buildImage
  .then(startWebServer)
  .then(startWebSocketServer)
  .then(() => {
    console.log();
    console.log();
    console.log("===========================================================");
    console.log("Spotify Ripper Webinterface started; Listening on port 3000");
    console.log("===========================================================");
    console.log();
  })
  .catch((error) => {
    console.log();
    console.log();
    console.log("============================================");
    console.log("Failed to start Spotify Ripper Webinterface!");
    console.log("============================================");
    console.log();
    console.log("ERROR", error);
    console.log();
  })