FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN yarn && yarn build

FROM node:alpine as production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
RUN yarn install --production
EXPOSE 8080 8000 5432 55003
CMD [ "node", "dist/server.js" ]