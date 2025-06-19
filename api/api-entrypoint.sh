#!/bin/sh
java -Djavax.net.ssl.trustStore=${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/java-cacerts -jar api.jar $@