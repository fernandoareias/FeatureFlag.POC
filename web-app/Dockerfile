FROM node:18 as build

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`