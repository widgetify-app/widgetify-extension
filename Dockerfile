FROM ubuntu:24.04

# نصب node و npm و غیره
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@11.3.0

WORKDIR /app

COPY . .

RUN rm -f package-lock.json
RUN rm -rf node_modules

RUN npm install --force || (rm -rf node_modules && npm install --force)
