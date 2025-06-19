FROM hashicorp/vault:1.19.5 AS runtime
RUN apk add --no-cache curl  
RUN mkdir /vault/init-data \
    && chown -R vault:vault /vault/init-data 
COPY vault-entrypoint.sh /vault-entrypoint.sh
COPY vault-init.sh /vault-init.sh
COPY vault-unseal.sh /vault-unseal.sh
COPY token-helper.sh /token-helper.sh
COPY password-policy.hcl /password-policy.hcl
COPY shared-policy.hcl /shared-policy.hcl
COPY config /vault/config
COPY vault-healthcheck.sh /healthcheck.sh
RUN echo 'token_helper = "/token-helper.sh"' >> /home/vault/.vault
EXPOSE 8080
# TODO run container as non-root user. (issue with memlock capability)
# USER vault 
ENTRYPOINT [ "/vault-entrypoint.sh" ]

FROM runtime AS dev

#this container does not need to run for testcoverage
FROM runtime AS testcoverage
CMD [ ]
ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM runtime AS staging

FROM runtime AS prod

