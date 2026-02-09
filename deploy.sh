#!/bin/sh
set -e

git pull
docker compose pull
docker compose build --pull
docker compose up -d --remove-orphans
echo "To remove unused docker files, run:"
echo "  docker system prune -a"