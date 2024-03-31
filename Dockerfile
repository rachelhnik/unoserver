FROM alpine:3.18

ENV NODE_VERSION 20.12.0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm run dev" ]