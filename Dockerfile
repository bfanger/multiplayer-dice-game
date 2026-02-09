FROM node:24-slim AS build

COPY . /app
WORKDIR /app
RUN npm install -g pnpm && pnpm install
RUN npx svelte-kit sync && npm run build
RUN pnpm prune --prod

FROM node:24-slim AS runtime

COPY --from=build /app/build/ /app/build
COPY --from=build /app/dist/ /app/dist
COPY --from=build /app/server.js /app/server.js
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

USER www-data

EXPOSE 8080
CMD ["node", "/app/server.js"]
