#!/bin/sh
CERT_TEMP_CERT_DAYS=1 #number of days that temp cert is valid for

if [ -d "${CERTBOT_DATA_PATH}/conf" ]; then
	# If the directory exists, we assume that the initial setup has already been done
	echo "Initial setup already done. Skipping initial startup script."

else
	# If the directory does not exist, we run the initial startup script
	echo "Running initial startup script..."
	/certbot-init.sh 
fi
