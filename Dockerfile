FROM node:24.2.0-bookworm

RUN npm install -g npm@11.3.0

WORKDIR /app

COPY . .

RUN npm install --force