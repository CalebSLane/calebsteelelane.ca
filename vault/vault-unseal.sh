#!/bin/sh
VAULT_ADDR=${PRIVATE_VAULT_WEB_ADDRESS}
export VAULT_ADDR
UNSEAL_KEY=$(grep 'Unseal Key 1' /vault/init-data/init-keys.txt | sed -r 's/^[^:]*: (.*)$/\1/')
vault operator unseal ${UNSEAL_KEY}  > /vault/init-data/unseal.txt