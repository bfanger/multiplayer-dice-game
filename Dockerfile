FROM node:18-alpine as build

COPY . /app

RUN cd /app && npm install --legacy-peer-deps
RUN cd /app && npm run build
RUN cd /app && npm prune --production


FROM node:18-alpine

COPY --from=build /app/build/ /app/build
COPY --from=build /app/dist/ /app/dist
COPY --from=build /app/server.js /app/server.js
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

CMD node /app/server.js

# Usage:
# docker run -rm -p 5173:5173 --env REDIS_URL=redis://host.docker.internal:6379 [image-name]