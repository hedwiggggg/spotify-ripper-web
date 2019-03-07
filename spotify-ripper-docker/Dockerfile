FROM debian:stretch-slim

ENV LANG C.UTF-8

ARG DEBIAN_FRONTEND=noninteractive

# Install packages
RUN apt-get update -qy && apt-get upgrade -qy
RUN apt-get install nano wget lame build-essential libffi-dev python-pip python-dev python3-dev python3-pip libffi-dev -y

WORKDIR /dependencies

# Download libspotify & compile it
COPY ./dependencies/libspotify-12.1.51-Linux-x86_64-release.tar.gz ./libspotify-12.1.51-Linux-x86_64-release.tar.gz
RUN tar xvf libspotify-12.1.51-Linux-x86_64-release.tar.gz && \
  rm -f libspotify-12.1.51-Linux-x86_64-release.tar.gz && \
	cd libspotify-12.1.51-Linux-x86_64-release && \
	make install prefix=/usr/local

# Install required tools for support for AAC (M4A container)
COPY ./dependencies/libfdk-aac-dev_0.1.4-2+b1_amd64.deb ./libfdk-aac-dev_0.1.4-2+b1_amd64.deb
COPY ./dependencies/libfdk-aac1_0.1.4-2+b1_amd64.deb ./libfdk-aac1_0.1.4-2+b1_amd64.deb
RUN apt-get install pkg-config automake autoconf -y && \
	dpkg -i libfdk-aac1_0.1.4-2+b1_amd64.deb && dpkg -i libfdk-aac-dev_0.1.4-2+b1_amd64.deb

# Compile libfdk-aac encoder
COPY ./dependencies/v0.6.2.tar.gz ./v0.6.2.tar.gz
RUN tar xvf v0.6.2.tar.gz && \
	rm -f v0.6.2.tar.gz && cd fdkaac-0.6.2 && \
	autoreconf -i && ./configure && make install

# Install a fork of spotify-ripper
COPY ./dependencies/spotify-ripper-morgaroth-2.9.6.tar.gz ./spotify-ripper-morgaroth-2.9.6.tar.gz
RUN pip3 install spotify-ripper-morgaroth-2.9.6.tar.gz

WORKDIR /

# Link our download location to /data in the container
VOLUME ["/ripped_music"]

# Copy needed files for spotify-ripper
COPY ./spotify_appkey.key /root/.spotify-ripper/spotify_appkey.key
COPY ./config.ini /root/.spotify-ripper/config.ini
