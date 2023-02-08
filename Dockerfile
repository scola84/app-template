FROM node:18

ARG SOURCE
LABEL org.opencontainers.image.source $SOURCE

EXPOSE 80 443
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npx tsc

CMD ["node", "."]
