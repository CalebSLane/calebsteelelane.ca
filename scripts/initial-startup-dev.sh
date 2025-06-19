#!/bin/bash -aeu
set -a # automatically export all variables
source .env
set +a

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROGRESS_ARG="--progress=${PROGRESS}"

docker compose ${PROGRESS_ARG} up -d --build vault.web.vault 
docker exec -it --user vault:vault \
	--env-file .env.secret \
	vault sh /vault-init.sh

${SCRIPT_DIR}/generate-temp-certs.sh

echo "Bringing up all containers ..."
docker compose ${PROGRESS_ARG} up -d --build  
