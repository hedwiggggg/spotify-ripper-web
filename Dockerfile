FROM node:10.15.1-alpine AS base


######
# spotify-ripper-docker
######

FROM base AS srd

WORKDIR /spotify-ripper-docker
COPY ./spotify-ripper-docker ./


######
# spotify-ripper-web-frontend
######

FROM base AS srwf

WORKDIR /spotify-ripper-web-frontend

COPY ./spotify-ripper-web-frontend/package.json ./
COPY ./spotify-ripper-web-frontend/yarn.lock ./
RUN yarn install

COPY ./spotify-ripper-web-frontend .
RUN yarn run build


######
# spotify-ripper-web-backend
######

FROM base AS srwb

WORKDIR /spotify-ripper-web-backend

COPY ./spotify-ripper-web-backend/package*.json ./
RUN npm install

COPY ./spotify-ripper-web-backend ./


######
# composed
######

FROM base AS release

COPY --from=srd /spotify-ripper-docker /spotify-ripper-docker
COPY --from=srwf /spotify-ripper-web-frontend /spotify-ripper-web-frontend
COPY --from=srwb /spotify-ripper-web-backend /spotify-ripper-web-backend

EXPOSE 3000 

COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "sh", "entrypoint.sh" ]