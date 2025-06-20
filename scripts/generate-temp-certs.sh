#!/bin/bash -aeu

PROGRESS_ARG="--progress=${PROGRESS}"

CERT_DOMAINS=(${PUBLIC_SERVER_DOMAIN})
CERT_DOMAINS+=("${AUTH_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${API_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${STATIC_APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${VAULT_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
# this is so we don't need to use localhost which confuses the containers, 
# but allows us to use certs that cover localhost anyways
if [ ${PUBLIC_SERVER_DOMAIN} = "host" ]; then 
	echo "127.0.0.1 ${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 ${AUTH_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 ${API_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 ${APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 ${STATIC_APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	echo "127.0.0.1 ${VAULT_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}" >> /etc/hosts 
	CERT_DOMAINS+=("${AUTH_WEB_SUBDOMAIN}.localhost")
	CERT_DOMAINS+=("${API_WEB_SUBDOMAIN}.localhost")
	CERT_DOMAINS+=("${APP_WEB_SUBDOMAIN}.localhost")
	CERT_DOMAINS+=("${STATIC_APP_WEB_SUBDOMAIN}.localhost")
	CERT_DOMAINS+=("${VAULT_WEB_SUBDOMAIN}.localhost")
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
	--entrypoint "/api-init.sh " ${API_WEB_SUBDOMAIN}.api