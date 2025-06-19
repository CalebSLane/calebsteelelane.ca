#!/bin/sh
if [ "${ENV}" = "testcoverage" ]; then
    echo "Skipping healthcheck for test coverage"
    exit 0
fi

curl -f http://localhost:8080/v1/sys/health || exit 1
