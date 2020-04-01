
FROM node:12.16-slim

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3052

RUN yarn build

CMD [ "yarn", "start" ]