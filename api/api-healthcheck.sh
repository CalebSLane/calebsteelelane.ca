#!/bin/sh

/usr/bin/curl -f http://localhost:8080/actuator/health || exit 1