FROM alpine:3.18

ENV NODE_VERSION 20.12.0

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm   

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm run dev" ]