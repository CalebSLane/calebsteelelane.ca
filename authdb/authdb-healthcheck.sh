#!/bin/sh
if [ "${ENV}" = "testcoverage" ]; then
    echo "Skipping healthcheck for test coverage"
    exit 0
fi

pg_isready -d ${POSTGRES_DB} -U ${POSTGRES_USER} || exit 1