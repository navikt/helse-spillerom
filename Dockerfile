FROM gcr.io/distroless/nodejs24-debian12@sha256:770cf694c472b838da3ed594aebc31143934b9c1bedc13b513131f100716cca5

WORKDIR /app

COPY package.json /app/
COPY next-logger.config.js /app/
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]
