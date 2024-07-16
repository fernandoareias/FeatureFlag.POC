FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
