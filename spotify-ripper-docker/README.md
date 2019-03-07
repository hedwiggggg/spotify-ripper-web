> A Debian Stretch (slim) image with python, pip, libspotify and spotify-ripper

## Prereqs
1. Install Docker and make sure the Docker daemon is running.
2. Place your libspotify appkey in the directory you're going to build from
3. Modify the config if needed

## Installation
1. `git clone https://github.com/thibmaek/spotify-ripper-docker`
2. Add username & password in the `config.ini` file in this repo
3. `docker build -t spotify-ripper .`
4. `docker run -itd -v /home/user/download:/data --name spotify-ripper spotify-ripper`

## Ripping
Default config will use the liblamemp3 encoder to rip to a MP3 container at 320kbps.
You can also rip to M4A (AAC) using the libfdk-aac encoder which is compiled into this image.
The spotify-ripper-morgaroth pip package embedded in this image will however 'monkey-patch' an M4A bug which makes it really incompatible with iTunes and causes iTunes to hang or crash when adding new files to the library. Use with caution!

Once the container is running, use docker exec to start ripping:

```bash
# You can add --remove-offline-cache to remove the libspotify offline cache and save disk space
# and avoid Docker storage conflicts.

# Running this will run the output in the current terminal window
docker exec spotify-ripper spotify-ripper spotify:album:… --remove-offline-cache

# Running this will run it detached in the background so you don't need to keep a terminal open
docker exec -d spotify-ripper spotify-ripper spotify:album:…
```
