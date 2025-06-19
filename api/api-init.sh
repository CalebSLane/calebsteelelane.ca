#!/bin/sh
cp $JAVA_HOME/lib/security/cacerts ${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/java-cacerts
keytool -importcert -keystore ${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/java-cacerts \
	-noprompt -alias my-cert -file ${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem