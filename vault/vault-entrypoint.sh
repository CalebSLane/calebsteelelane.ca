#!/bin/sh
if [ ${ENV} = "testcoverage" ]; then
    echo "Skipping init for test coverage"
    exit 0
fi
vault server -config=/vault/config/vault-config.json "$@"