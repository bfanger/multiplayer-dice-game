#!/bin/sh
set -e

git pull
docker-compose down
docker-compose pull
docker-compose build
docker-compose up -d
echo "To remove unused images, run:"
echo "  docker image prune -a"