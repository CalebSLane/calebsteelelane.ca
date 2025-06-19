#!/bin/sh
if [ "${ENV}" = "testcoverage" ]; then
    echo "Skipping healthcheck for test coverage"
    exit 0
fi
timeout 10s bash -c ':> /dev/tcp/localhost/8080' || exit 1