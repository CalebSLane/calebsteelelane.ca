FROM postgres:17.5-alpine3.22 AS runtime
COPY ./authdb-entrypoint.sh /authdb-entrypoint.sh
COPY ./authdb-healthcheck.sh /healthcheck.sh
RUN apk add --no-cache curl 
RUN mkdir temp
RUN addgroup authdb_group --gid 8000
RUN adduser -D authdb_user authdb_group 
RUN chown -R authdb_user:authdb_group /authdb-entrypoint.sh
RUN chown -R authdb_user:authdb_group /healthcheck.sh
RUN chown -R authdb_user:authdb_group /temp
RUN chmod 777 /temp
RUN sh -c | chown -R authdb_user:authdb_group /var/lib/postgresql/data
USER authdb_user
ENTRYPOINT ["/authdb-entrypoint.sh"]
CMD ["postgres"]

FROM runtime AS dev

#this container does not need to run for testcoverage
FROM runtime AS testcoverage
CMD [ ]
ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM runtime AS staging

FROM runtime AS prod

