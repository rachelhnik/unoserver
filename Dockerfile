FROM alpine:3.18

ENV NODE_VERSION 20.12.0

WORKDIR /app

COPY package*.json ./

RUN sudo chown -R ubuntu:ubuntu /var/www/uno
RUN sudo chmod -R 755 /var/www/uno

RUN npm install

COPY . .

RUN sudo chown -R jenkins:jenkins /var/www/uno


EXPOSE 8000

CMD [ "npm run dev" ]