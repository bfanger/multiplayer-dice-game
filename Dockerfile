FROM node:24-slim AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /
WORKDIR /app
RUN npm install -g pnpm && pnpm install
COPY . /app
ENV REDIS_URL="redis://redis:6379"
ENV LOKI_URL="http://loki:3100"
RUN npm run build
RUN pnpm prune --prod

FROM node:24-slim AS runtime

ENV NODE_ENV="production"
ENV REDIS_URL="redis://redis:6379"
ENV LOKI_URL="http://loki:3100"

COPY --from=build /app/build/ /app/build
COPY --from=build /app/dist/ /app/dist
COPY --from=build /app/server.js /app/server.js
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

USER www-data

EXPOSE 1888
CMD ["node", "/app/server.js"]
