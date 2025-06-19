#!/bin/sh
curl --silent -H "X-Vault-Token: ${SHARED_VAULT_TOKEN}" \
    -X GET ${PUBLIC_VAULT_WEB_ADDRESS}/v1/${SHARED_VAULT_PATH}/data/${PROJECT_NAME} \
    --cacert "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem" > "/tmp/uploads/${PROJECT_NAME}"
sed -E -i 's/.*"data":\{"data":\{(.*)\},"metadata".*/\1/g' "/tmp/uploads/${PROJECT_NAME}"
sed -E -i 's/,/\n/g' "/tmp/uploads/${PROJECT_NAME}"
sed -E -i 's/[-\."]//g' "/tmp/uploads/${PROJECT_NAME}"
sed -E -i 's/:/="/g' "/tmp/uploads/${PROJECT_NAME}"
sed -E -i 's/(.+)/\1"/g' "/tmp/uploads/${PROJECT_NAME}"
grep "DB_PASSWORD" "/tmp/uploads/${PROJECT_NAME}" > /tmp/uploads/DB_PASSWORD
grep "KC_BOOTSTRAP_ADMIN_PASSWORD" "/tmp/uploads/${PROJECT_NAME}" > /tmp/uploads/KC_BOOTSTRAP_ADMIN_PASSWORD
sed -E -i 's/^.*DB_PASSWORD="(.*)".*$/\1/g' /tmp/uploads/DB_PASSWORD 
sed -E -i 's/^.*KC_BOOTSTRAP_ADMIN_PASSWORD="(.*)".*$/\1/g' /tmp/uploads/KC_BOOTSTRAP_ADMIN_PASSWORD

KC_DB_PASSWORD="$(cat /tmp/uploads/DB_PASSWORD)"
KC_BOOTSTRAP_ADMIN_PASSWORD="$(cat /tmp/uploads/KC_BOOTSTRAP_ADMIN_PASSWORD)"
export KC_DB_PASSWORD 
export KC_BOOTSTRAP_ADMIN_PASSWORD 

rm "/tmp/uploads/${PROJECT_NAME}"
rm /tmp/uploads/DB_PASSWORD
rm /tmp/uploads/KC_BOOTSTRAP_ADMIN_PASSWORD

/opt/keycloak/bin/kc.sh "$@"