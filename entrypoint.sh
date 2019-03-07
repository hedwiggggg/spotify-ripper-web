#!/bin/sh

pid_node=0

term_handler() {
  if [ $pid_node -ne 0 ]; then
    kill -SIGTERM "$pid_node"
    wait "$pid_node"
  fi

  exit 130;
}

trap term_handler INT TERM

node ./spotify-ripper-web-backend/app.js &
pid_node="$!"

while true
do
  sleep 1

done
