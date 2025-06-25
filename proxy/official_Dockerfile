FROM nginx:1.27.4-alpine3.21-slim AS runtime
RUN apk add --no-cache curl 
#removing user directive since we're running the container as non-root
RUN sed -i 's,user  nginx;,,' /etc/nginx/nginx.conf
#this allows us to mount just the pid file as a tmpfs that is writeable 
RUN sed -i 's,/var/run/nginx.pid,/var/run/nginx/nginx.pid,' /etc/nginx/nginx.conf
RUN mkdir /var/run/nginx/ && chown -R nginx:nginx /var/run/nginx/
#this allows us to run the container as a non-root user with fewer capabilities by using non-privileged ports
EXPOSE 8080 8443
RUN addgroup nginx_group --gid 8000
RUN adduser -D nginx_user nginx_group
RUN mkdir -p "/var/www/certbot" \
    && mkdir -p "/etc/letsencrypt" \
    && chown -R nginx_user:nginx_group "/var/www/certbot" \
    && chown -R nginx_user:nginx_group "/etc/letsencrypt"
COPY conf.d/templates/default.conf.template /etc/nginx/templates/default.conf.template
COPY conf.d/templates/subdomains/app.web.conf.template /etc/nginx/templates/subdomains/app.web.conf.template
COPY conf.d/templates/subdomains/api.web.conf.template /etc/nginx/templates/subdomains/api.web.conf.template
COPY conf.d/templates/subdomains/auth.web.conf.template /etc/nginx/templates/subdomains/auth.web.conf.template
COPY conf.d/templates/subdomains/staticapp.web.conf.template /etc/nginx/templates/subdomains/staticapp.web.conf.template
COPY conf.d/templates/subdomains/vault.web.conf.template /etc/nginx/templates/subdomains/vault.web.conf.template    
# COPY conf.d/templates/subdomains/${APP_WEB_SUBDOMAIN}.conf.template /etc/nginx/templates/subdomains/${APP_WEB_SUBDOMAIN}.conf.template
# COPY conf.d/templates/subdomains/${API_WEB_SUBDOMAIN}.conf.template /etc/nginx/templates/subdomains/${API_WEB_SUBDOMAIN}.conf.template
# COPY conf.d/templates/subdomains/${AUTH_WEB_SUBDOMAIN}.conf.template /etc/nginx/templates/subdomains/${AUTH_WEB_SUBDOMAIN}.conf.template
# COPY conf.d/templates/subdomains/${STATIC_APP_WEB_SUBDOMAIN}.conf.template /etc/nginx/templates/subdomains/${STATIC_APP_WEB_SUBDOMAIN}.conf.template
# COPY conf.d/templates/subdomains/${VAULT_WEB_SUBDOMAIN}.conf.template /etc/nginx/templates/subdomains/${VAULT_WEB_SUBDOMAIN}.conf.template
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

