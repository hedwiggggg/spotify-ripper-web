# spotify-ripper-web
## Introduction

This repository aimed to create an easy-to-use web interface for the spotify-ripper. Archiving this goal I had the following point in the back of my head:

- Parallel downloads of multiple users

So I decided on the following project structure:

spotify-ripper-docker:
- This is just a dockerized version of the spotify-ripper, including some adjustments to better handle the standard data streams and bring them to the web interface.

spotify-ripper-web-backend:
- This is a node.js application which communicates with the frontend via websockets.
- It creates and starts new containers and forwards the standard data streams to the UI via Websocket.

spotify-ripper-web-frontend:
- This is a vue.js spa, communicating with the node.js backend; Here you can also finally download the music.

## Things that aren't so beautiful:

- The project actually consists of three projects, which would probably have been much more intelligent to separate.
- No TDD; not even the vue.js project
- Implemented the spotify-ripper as a zip file; this would also be a separate project...
- Not as much use of environment vars as I should have; there are some things hardcoded, like the websocket port
- Not the worst and ugliest code; but alsonot the cleanest one..

## Installation

The installation should be quite simple by dockerization.

### Prequesites

1. Installing docker and docker-compose
2. rename `.env.example` to `.env` and change the path according tr environment.
3. add your `spotify_appkey.key` to the `spotify-ripper-docker` folder
4. (adjust `docker-compose.yml` to mount your docker.sock)

### Run the application

To do this you can simply run `docker-compose up --build` (Depending on how you configured Docker, sudo may be required)
    
FYI: This whole repo is optimized and tested on Ubuntu 18.04.
    
If all went well, it should look something like this: (remember that port 3000 is in the container and mapped outside by your adjustments in the `docker-compose.yml`)
    
![Console](/screenshots/screenshot_1.png "Console")
    
Then you should be able to access it by `http://localhost:<your_port>/web/`

## Screenshots

![spotify-ripper web-ui](/screenshots/screenshot_2.png "spotify-ripper web-ui")
![spotify-ripper web-ui](/screenshots/screenshot_3.png "spotify-ripper web-ui")
![spotify-ripper web-ui](/screenshots/screenshot_4.png "spotify-ripper web-ui")
![spotify-ripper web-ui](/screenshots/screenshot_5.png "spotify-ripper web-ui")
