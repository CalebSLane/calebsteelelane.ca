#!/bin/sh
if [ "${ENV}" = "testcoverage" ]; then
    echo "Skipping healthcheck for test coverage"
    exit 0
fi

/usr/bin/curl -f http://localhost:${NGINX_HTTP_PORT}/health || exit 1