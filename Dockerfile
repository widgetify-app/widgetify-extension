FROM node:24

WORKDIR /app

COPY . .

RUN rm -f package-lock.json \
    && rm -rf node_modules

RUN npm install -g npm@11.3.0

RUN npm install --force || (rm -rf node_modules && npm install --force)
