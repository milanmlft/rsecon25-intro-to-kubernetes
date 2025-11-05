FROM node:24-alpine

COPY . /src
WORKDIR /src

ARG APP=app.js
ENV APP=$APP

RUN npm install express
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
