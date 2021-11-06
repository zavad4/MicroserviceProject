FROM node:14 AS build

WORKDIR /usr/src/
COPY ./services/dbc_service .
COPY ./services/dbc_service/package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start"]
