FROM alpine:3.19

ENV NODE_VERSION 20.12.0

WORKDIR /app

COPY package*.json ./

RUN apk add --update nodejs npm

RUN npm install

COPY . .

EXPOSE 8000

CMD nodemon src/server.ts