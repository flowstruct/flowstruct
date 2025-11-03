FROM node:22-alpine

RUN apk add --no-cache bash git build-base curl ncurses

WORKDIR /workspace

RUN npm install -g typescript typescript-language-server prettier eslint

EXPOSE 2087

CMD sh -c "npx typescript-language-server --tcp --port 2087 & exec sh"
