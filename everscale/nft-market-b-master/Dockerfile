FROM node:10-alpine
RUN apk add --no-cache imagemagick && apk add --no-cache imagemagick-dev
RUN apk add --no-cache libc6-compat
RUN ln -s /lib/ld-musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

RUN npm install -g nodemon
RUN npm install -g typescript

WORKDIR /api
COPY . /api

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

RUN npm update
RUN npm install
RUN tsc

EXPOSE 3001
CMD ["node", ,"run", "start"]