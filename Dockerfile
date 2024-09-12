FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 
RUN apk add --no-cache git

RUN npm run build

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/package*.json ./

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 50051

CMD ["node", "dist/main"]