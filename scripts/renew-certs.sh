#!/bin/bash -aeu


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "### attempting to refresh certs ..."
docker compose -f "${SCRIPT_DIR}/../docker-compose.yml" run --rm --entrypoint "\
  certbot certonly --keep-until-expiring \
    "$@" \
    --agree-tos \
    --no-eff-email" certbot

echo "### Reloading nginx ..."
docker-compose -f "${SCRIPT_DIR}/../docker-compose.yaml" exec proxy nginx -s reload