FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm && pnpm install

EXPOSE 5173
EXPOSE 4321
