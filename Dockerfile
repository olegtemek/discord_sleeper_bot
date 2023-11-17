FROM node:18.18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


ENV TZ=GMT-6

ARG BOT_TOKEN
ARG END_HOUR
ARG START_HOUR

ENV BOT_TOKEN=$BOT_TOKEN
ENV END_HOUR=$END_HOUR
ENV START_HOUR=$START_HOUR

CMD [ "npm", "run","start:dev" ]