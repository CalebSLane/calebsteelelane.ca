#!/bin/sh
if [ "${ENV}" = "testcoverage" ]; then
    echo "Skipping healthcheck for test coverage"
    exit 0
fi

exit 1