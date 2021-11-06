FROM node:14 AS build

WORKDIR /usr/src/
COPY ./services/root_service .
COPY ./services/root_service/package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start"]
