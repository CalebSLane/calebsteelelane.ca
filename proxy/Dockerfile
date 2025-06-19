FROM nginx:1.27.4-alpine3.21-slim AS runtime
RUN apk add --no-cache curl 
#removing user directive since we're running the container as non-root
RUN sed -i 's,user  nginx;,,' /etc/nginx/nginx.conf
#this allows us to mount just the pid file as a tmpfs that is writeable 
RUN sed -i 's,/var/run/nginx.pid,/var/run/nginx/nginx.pid,' /etc/nginx/nginx.conf
#this allows us to run the container as a non-root user with fewer capabilities by using non-privileged ports
EXPOSE 80 443
RUN addgroup nginx_group --gid 8000
RUN adduser -D nginx_user nginx_group
RUN mkdir -p "/var/www/certbot" \
    && mkdir -p "/etc/letsencrypt" \
    && chown -R nginx_user:nginx_group "/var/www/certbot" \
    && chown -R nginx_user:nginx_group "/etc/letsencrypt"
COPY conf.d/templates /etc/nginx/templates
COPY proxy-healthcheck.sh /healthcheck.sh
RUN chown -R nginx_user:nginx_group /etc/nginx/conf.d
RUN chown -R nginx_user:nginx_group /etc/nginx/templates
RUN chown -R nginx_user:nginx_group /healthcheck.sh
USER nginx_user
CMD ["nginx", "-g", "daemon off;"]

FROM runtime AS dev

#this container does not need to run for testcoverage
FROM runtime AS testcoverage
CMD [ ]
ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM runtime AS staging

FROM runtime AS prod

