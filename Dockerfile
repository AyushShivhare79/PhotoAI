FROM node:22.15.0-alpine
ARG DATABASE_URL

WORKDIR /app

RUN npm i pnpm -g

COPY . .

RUN pnpm install
RUN pnpm build


EXPOSE 3000

CMD [ "pnpm","run","start" ]
