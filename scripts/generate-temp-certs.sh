#!/bin/bash -aeu

PROGRESS_ARG="--progress=${PROGRESS}"

CERT_DOMAINS=(${PUBLIC_SERVER_DOMAIN})
CERT_DOMAINS+=("auth.web.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("api.web.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("app.web.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("vault.web.${PUBLIC_SERVER_DOMAIN}")
# this is so we don't need to use localhost which confuses the containers, 
# but allows us to use certs that cover localhost anyways
if [ ${PUBLIC_SERVER_DOMAIN} = "host" ]; then 
	echo "127.0.0.1 ${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 auth.web.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 api.web.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 app.web.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 vault.web.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	CERT_DOMAINS+=("auth.web.localhost")
	CERT_DOMAINS+=("api.web.localhost")
	CERT_DOMAINS+=("app.web.localhost")
	CERT_DOMAINS+=("vault.web.localhost")
fi
EMAIL=${EMAIL:-}

OLD_IFS="$IFS"
IFS=","
DOMAINS_AS_STRING=${CERT_DOMAINS[*]}
IFS=${OLD_IFS}
docker compose ${PROGRESS_ARG} run --name init-certbot --rm --no-deps --build \
	--env PUBLIC_SERVER_DOMAIN=${PUBLIC_SERVER_DOMAIN} \
	--env CERT_RSA_KEY_SIZE=${CERT_RSA_KEY_SIZE} --env CERT_DOMAINS=${DOMAINS_AS_STRING} \
	--env CERTBOT_DATA_PATH=${CERTBOT_DATA_PATH} --env EMAIL=${EMAIL} \
	--env CERT_ROOT_PATH=${CERT_ROOT_PATH} --env CERT_TEMP_CERT_DAYS=${CERT_TEMP_CERT_DAYS} \
	--entrypoint "/certbot-init.sh " certbot
echo "Successfully created self-signed certs"

docker compose ${PROGRESS_ARG} run --name init-java --rm --no-deps --build \
	--env PUBLIC_SERVER_DOMAIN=${PUBLIC_SERVER_DOMAIN} \
	--env CERT_ROOT_PATH=${CERT_ROOT_PATH} \
	--entrypoint "/api-init.sh " api.web.api