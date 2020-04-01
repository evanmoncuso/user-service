
FROM node:12.16-slim

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3050

RUN yarn build

CMD [ "yarn", "start" ]