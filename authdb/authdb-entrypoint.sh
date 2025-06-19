#!/bin/sh
# first call is to see results in case debugging is necessary
echo "curl -H \"X-Vault-Token: ${SHARED_VAULT_TOKEN}\" -X GET ${PUBLIC_VAULT_WEB_ADDRESS}/v1/${SHARED_VAULT_PATH}/data/${PROJECT_NAME} --cacert \"${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem\""
curl -H "X-Vault-Token: ${SHARED_VAULT_TOKEN}" \
    -X GET ${PUBLIC_VAULT_WEB_ADDRESS}/v1/${SHARED_VAULT_PATH}/data/${PROJECT_NAME} \
    --cacert "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem" 
curl --silent -H "X-Vault-Token: ${SHARED_VAULT_TOKEN}" \
    -X GET ${PUBLIC_VAULT_WEB_ADDRESS}/v1/${SHARED_VAULT_PATH}/data/${PROJECT_NAME} \
    --cacert "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem" > "/tmp/${PROJECT_NAME}"
sed -E -i 's/.*"data":\{"data":\{(.*)\},"metadata".*/\1/g' "/tmp/${PROJECT_NAME}"
sed -E -i 's/,/\n/g' "/tmp/${PROJECT_NAME}"
sed -E -i 's/[-\."]//g' "/tmp/${PROJECT_NAME}"
sed -E -i 's/:/="/g' "/tmp/${PROJECT_NAME}"
sed -E -i 's/(.+)/\1"/g' "/tmp/${PROJECT_NAME}"
grep "DB_PASSWORD" "/tmp/${PROJECT_NAME}" > /tmp/DB_PASSWORD
sed -E -i 's/^.*DB_PASSWORD="(.*)".*$/\1/g' /tmp/DB_PASSWORD
POSTGRES_PASSWORD="$(cat /tmp/DB_PASSWORD)"
export POSTGRES_PASSWORD 
rm "/tmp/${PROJECT_NAME}"
rm /tmp/DB_PASSWORD

/usr/local/bin/docker-entrypoint.sh "$@"