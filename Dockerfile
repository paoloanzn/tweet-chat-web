FROM --platform=amd64 node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src/server ./src/server

EXPOSE 8080

CMD ["node", "src/server/main.js"] 