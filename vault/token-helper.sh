#!/bin/sh

write_error(){ >&2 echo "$@"; }

# Customize the hash key for tokens. Currently, we remove the strings
# 'https://', '.', and ':' from the passed address (Vault address environment
# by default) because jq has trouble with special characeters in JSON field
# names
createHashKey() {
  
  local key=""

  if [ -z "${2}" ] ; then key="${VAULT_ADDR}" 
  else                      key="${2}"
  fi
  
  # We index the token according to the Vault server address by default so
  # return an error if the address is empty
  if [ -z "${key}" ] ; then
    write_error "Error: VAULT_ADDR environment variable unset."
    exit 100
  fi

  key=$(echo "$key" | sed 's,http://,,g')
  key=$(echo "$key" | sed 's,https://,,g')

  echo "addr-${key}"
}

TOKEN_PATH="/tmp/vault_tokens"
KEY=$(createHashKey "$@")
TOKEN="null"

mkdir -p "${TOKEN_PATH}"
TOKEN_FILE="${TOKEN_PATH}/${KEY}"
# If the token file does not exist, create it
if [ ! -f ${TOKEN_FILE} ] ; then
   touch ${TOKEN_FILE}
fi

case "${1}" in
    "get")

      # Read the current 
      cat ${TOKEN_FILE}
    ;;

    "store")
      
      # Get the token from stdin
      read TOKEN

      echo "${TOKEN}" 

      # 
      echo -n "${TOKEN}" > "${TOKEN_FILE}"      
    ;;

    "erase")
      rm "${TOKEN_FILE}"
    ;;

    *)
      # change to stderr for real code
      write_error "Error: Provide a valid command: get, store, or erase."
      exit 101
esac
exit 0
