#!/bin/bash -aeu
set -a # automatically export all variables
source .env
set +a
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PROGRESS_ARG="--progress=${PROGRESS}"
# Enable build mode if needed
if [ ${BUILD} = "true" ]; then BUILD_ARG="--build"; else BUILD_ARG=""; fi

docker compose ${PROGRESS_ARG} up -d ${BUILD_ARG} vault.web.vault 
sleep 5
docker exec -it --user vault:vault \
	--env-file .env.secret \
	vault sh /vault-init.sh


${SCRIPT_DIR}/generate-temp-certs.sh
 
echo "### Starting proxy ..."
docker compose ${PROGRESS_ARG} up ${BUILD_ARG} --force-recreate -d proxy
echo

echo "### Deleting dummy certificate for ${PUBLIC_SERVER_DOMAIN} ..."
docker compose ${PROGRESS_ARG} run ${BUILD_ARG} --rm --no-deps --entrypoint "
  rm -Rf ${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}" certbot
docker compose ${PROGRESS_ARG} run ${BUILD_ARG} --rm --no-deps --entrypoint "
  rm -Rf ${CERT_ROOT_PATH}/archive/${PUBLIC_SERVER_DOMAIN}" certbot
docker compose ${PROGRESS_ARG} run ${BUILD_ARG} --rm --no-deps --entrypoint "
  rm -Rf ${CERT_ROOT_PATH}/renewal/${PUBLIC_SERVER_DOMAIN}.conf" certbot
echo "Removed dummy certificate for ${PUBLIC_SERVER_DOMAIN}"
echo

echo "### Requesting Let's Encrypt certificate for ${PUBLIC_SERVER_DOMAIN} ..."
CERT_DOMAINS=(${PUBLIC_SERVER_DOMAIN})
CERT_DOMAINS+=("${AUTH_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${API_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${STATIC_APP_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
CERT_DOMAINS+=("${VAULT_WEB_SUBDOMAIN}.${PUBLIC_SERVER_DOMAIN}")
DOMAIN_ARGS=""
for DOMAIN in "${CERT_DOMAINS[@]}"; do
	DOMAIN_ARGS+="-d ${DOMAIN} "
done

# Select appropriate email arg
case "${EMAIL}" in
"") EMAIL_ARG="--register-unsafely-without-email" ;;
" ") EMAIL_ARG="--register-unsafely-without-email" ;;
*) EMAIL_ARG="--email ${EMAIL}" ;;
esac

# Enable staging mode if needed
if [ ${ENV} = "staging" ]; then STAGING_ARG="--staging"; else STAGING_ARG=""; fi

docker compose ${PROGRESS_ARG} run ${BUILD_ARG} --rm --entrypoint "\
  certbot certonly --webroot -w ${CERTBOT_DATA_PATH} \
    ${STAGING_ARG} \
    ${EMAIL_ARG} \
    ${DOMAIN_ARGS} \
    --rsa-key-size ${CERT_RSA_KEY_SIZE} \
    --no-eff-email \
    --agree-tos" certbot
echo

echo "### Reloading nginx ..."
docker compose ${PROGRESS_ARG} exec proxy nginx -s reload
echo

echo "Bringing up all containers ..."
docker compose ${PROGRESS_ARG} up -d ${BUILD_ARG}

echo "### Adding cron job for certificate renewal ..."
crontab -l | grep -q "${SCRIPT_DIR}/certbot/scripts/renew_certs.sh" && echo 'crontab task already exists' ||
	(	crontab -l 2>/dev/null || true
		echo "0 0 * * * ${SCRIPT_DIR}/certbot/scripts/renew_certs.sh --webroot -w ${CERTBOT_DATA_PATH} ${STAGING_ARG} ${EMAIL_ARG} ${DOMAIN_ARGS} --rsa-key-size ${CERT_RSA_KEY_SIZE}"
	) | crontab - 