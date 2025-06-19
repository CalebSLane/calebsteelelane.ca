#!/bin/sh
SUBJECT_ALT_NAME_ARG=""
CERT_TEMP_CERT_DAYS="${CERT_TEMP_CERT_DAYS:-1}" # number of days that temp cert is valid for
FIRST_LOOP=true
if [ -z "${CERT_DOMAINS}" ]; then
	echo "No web domain provided. Please set CERT_DOMAINS environment variable."
	exit 1
fi
OLD_IFS="$IFS"
IFS=","
set -- ${CERT_DOMAINS}
IFS=${OLD_IFS}
DNS_NUM=0
IP_NUM=0
for DOMAIN in "$@"; do
	if [ "${FIRST_LOOP}" = true ]; then
		FIRST_LOOP=false
		echo "[req]" >> /certbot/temp/sslconfig.conf
		echo "distinguished_name=req_distinguished_name" >> /certbot/temp/sslconfig.conf
		echo "x509_extensions = v3_ca" >> /certbot/temp/sslconfig.conf
		echo "[req_distinguished_name]" >> /certbot/temp/sslconfig.conf
		echo "CN = ${PUBLIC_SERVER_DOMAIN}" >> /certbot/temp/sslconfig.conf
		echo "[v3_ca]" >> /certbot/temp/sslconfig.conf
		echo "subjectAltName=@alternate_names" >> /certbot/temp/sslconfig.conf
		echo "[alternate_names]" >> /certbot/temp/sslconfig.conf
		SUBJECT_ALT_NAME_ARG="-config /certbot/temp/sslconfig.conf"
		echo "Adding primary domain ${PUBLIC_SERVER_DOMAIN} to certificate ..."
		# SUBJECT_ALT_NAME_ARG="-addext \"subjectAltName = DNS:${DOMAIN}"
	else	
		echo "Adding alternate domain ${DOMAIN} to certificate ..."
		# SUBJECT_ALT_NAME_ARG="${SUBJECT_ALT_NAME_ARG}, DNS:${DOMAIN}"
	fi
	if expr "X$DOMAIN" : 'X[.0-9]+' >/dev/null; then
		echo "IP.${IP_NUM} = ${DOMAIN}" >> /certbot/temp/sslconfig.conf
		IP_NUM=$((IP_NUM + 1))
	else 
		echo "DNS.${DNS_NUM} = ${DOMAIN}" >> /certbot/temp/sslconfig.conf
		DNS_NUM=$((DNS_NUM + 1))
	fi
done
# SUBJECT_ALT_NAME_ARG="${SUBJECT_ALT_NAME_ARG}\""

if [ -d "${CERTBOT_DATA_PATH}/conf" ]; then
	while true; do
		echo "Existing configuration data found for ${PUBLIC_SERVER_DOMAIN}. "
		if [ -z "${OVERWRITE_CERTS_CONFIRM}"]; then
			read -p "Continue and replace existing certificate? (y/n) [default: 'n']: " OVERWRITE_CERTS_CONFIRM
		fi
		OVERWRITE_CERTS_CONFIRM=${OVERWRITE_CERTS_CONFIRM:-n}
		case ${OVERWRITE_CERTS_CONFIRM} in
		[Yy]*)
			echo "replacing existing certificate ..."
			break
			;;
		[Nn]*)
			echo "exiting certificate generation..."
			exit 1
			;;
		*)
			echo "Please answer y or n."
			OVERWRITE_CERTS_CONFIRM=""
			;;
		esac
	done
fi
if [ ! -e "${CERTBOT_DATA_PATH}/conf/options-ssl-nginx.conf" ] || [ ! -e "${CERTBOT_DATA_PATH}/conf/ssl-dhparams.pem" ]; then
	echo "### Downloading recommended TLS parameters ..."
	mkdir -p "${CERTBOT_DATA_PATH}/conf"
	curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf >"${CERTBOT_DATA_PATH}/conf/options-ssl-nginx.conf"
	curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem >"${CERTBOT_DATA_PATH}/conf/ssl-dhparams.pem"
fi
mkdir -p "${CERTBOT_DATA_PATH}/conf/live/${PUBLIC_SERVER_DOMAIN}"
mkdir -p "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}"

echo "### Creating dummy certificate for ${PUBLIC_SERVER_DOMAIN} ..."
openssl req -quiet -x509 -nodes -newkey rsa:${CERT_RSA_KEY_SIZE} -days ${CERT_TEMP_CERT_DAYS} \
	-keyout "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/privkey.pem" \
	-out "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/fullchain.pem" \
	-subj "/CN=${PUBLIC_SERVER_DOMAIN}" \
	${SUBJECT_ALT_NAME_ARG} 

cp "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/fullchain.pem" "${CERT_ROOT_PATH}/live/${PUBLIC_SERVER_DOMAIN}/cert.pem"
