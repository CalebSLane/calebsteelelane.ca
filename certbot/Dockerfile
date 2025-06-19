# syntax=docker/dockerfile:1.3
FROM certbot/certbot:v4.1.1 AS runtime
RUN apk add --no-cache curl 
RUN addgroup certbot_group --gid 8000
RUN adduser -D certbot_user certbot_group
RUN mkdir -p "/var/www/certbot" \
    && mkdir -p "/etc/letsencrypt" \
    && chown -R certbot_user:certbot_group "/var/www/certbot" \
    && chown -R certbot_user:certbot_group "/etc/letsencrypt"

COPY ./certbot-healthcheck.sh /healthcheck.sh
COPY ./certbot-entrypoint.sh /certbot-entrypoint.sh
COPY ./certbot-init.sh /certbot-init.sh
RUN chown -R certbot_user:certbot_group /healthcheck.sh
RUN chown -R certbot_user:certbot_group /certbot-entrypoint.sh
RUN chown -R certbot_user:certbot_group /certbot-init.sh

USER certbot_user
ENTRYPOINT [ "/certbot-entrypoint.sh" ]

FROM runtime AS dev

#this container does not need to run for testcoverage
FROM runtime AS testcoverage
CMD [ ]
ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM runtime AS staging

FROM runtime AS prod