FROM node:14 AS build

WORKDIR /usr/src/
COPY . .
COPY package*.json ./

RUN ls

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start"]
