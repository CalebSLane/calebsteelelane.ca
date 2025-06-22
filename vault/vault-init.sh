#!/bin/sh
VAULT_ADDR=${PRIVATE_VAULT_WEB_ADDRESS}
export VAULT_ADDR
INIT_STATUS=$(vault operator init -status)
if [ "${INIT_STATUS}" = "Vault is initialized" ]; then
    echo "Vault is already initialized. Skipping initialization."
else
    vault operator init -key-shares=1 -key-threshold=1 -format=table -status > /vault/init-data/init-keys.txt
    sleep 10
    ROOT_VAULT_TOKEN=$(grep 'Initial Root Token' /vault/init-data/init-keys.txt | sed -r 's/^[^:]*: (.*)$/\1/')
    /vault-unseal.sh
    # VAULT_CACERT="${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem"
    # export VAULT_CACERT
    vault login ${ROOT_VAULT_TOKEN} > /vault/init-data/login.txt
    vault auth enable userpass 
    vault write sys/policies/password/randomize policy=@password-policy.hcl
    vault secrets enable -path ${SHARED_VAULT_PATH} -version 2 kv 
    vault kv put -cas=0 -mount=${SHARED_VAULT_PATH} ${PROJECT_NAME} \
        spring.security.oauth2.client.registration.keycloak.client-secret=$(vault read -field password sys/policies/password/randomize/generate) \
        BACKEND_CLIENT_SECRET=$(vault read -field password sys/policies/password/randomize/generate) \
        DB_PASSWORD=$(vault read -field password sys/policies/password/randomize/generate) \
        KC_BOOTSTRAP_ADMIN_PASSWORD=$(vault read -field password sys/policies/password/randomize/generate) > /vault/init-data/secrets-result.txt
    vault policy write shared-access-policy /shared-policy.hcl 
    VAULT_PASSWORD=$(vault read -field password sys/policies/password/randomize/generate)
    vault write auth/userpass/users/${PROJECT_NAME}-user password=${VAULT_PASSWORD}
    vault write auth/userpass/users/${PROJECT_NAME}-user \
        policies=shared-access-policy 
    vault token create -policy=shared-access-policy > /vault/init-data/token.txt

    SHARED_VAULT_TOKEN=$(grep 'token ' /vault/init-data/token.txt | sed -r 's/^[^h]*(.*)$/\1/')
    UNSEAL_KEY=$(grep 'Unseal Key 1' /vault/init-data/init-keys.txt | sed -r 's/^[^:]*: (.*)$/\1/')
    echo 
    echo 
    echo "Copy the following values somewhere for safekeeping:"
    echo "  * ROOT_VAULT_TOKEN=${ROOT_VAULT_TOKEN}"
    echo "  * UNSEAL_KEY=${UNSEAL_KEY}"
    echo "  * VAULT_PASSWORD=${VAULT_PASSWORD}"
    echo "Replace the contents of .env.secret with: "
    echo "  * SHARED_VAULT_TOKEN=${SHARED_VAULT_TOKEN}"
    read -p "Press enter once the above tasks are done (this will delete the above information): " TEST
    echo "cleaning up init-data files..."
    rm /vault/init-data/*
    clear
fi