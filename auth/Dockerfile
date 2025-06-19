FROM registry.access.redhat.com/ubi9 AS ubi-micro-build
RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs curl --releasever 9 --setopt install_weak_deps=false --nodocs -y && \
    dnf --installroot /mnt/rootfs clean all && \
    rpm --root /mnt/rootfs -e --nodeps setup

FROM quay.io/keycloak/keycloak:26.1.2-0 AS builder

#all current keycloak build arguments
ARG KC_DB_ARG=postgres
#ARG KC_DB_DRIVER_ARG=
#ARG KC_TRANSACTION_XA_ENABLED_ARG=
#ARG KC_FEATURES_ARG=
#ARG KC_FEATURES_DISABLED_ARG=
#ARG KC_HTTP_RELATIVE_PATH_ARG=
#ARG KC_HTTPS_CLIENT_AUTH_ARG=
ARG KC_HEALTH_ENABLED_ARG=true
#ARG KC_HTTP_MANAGEMENT_RELATIVE_PATH_ARG=
#ARG KC_HTTPS_MANAGEMENT_CLIENT_AUTH_ARG=
ARG KC_METRICS_ENABLED_ARG=true
#ARG KC_VAULT_ARG=
#ARG KC_TRACING_ENABLED_ARG=
#ARG KC_TRACING_JDBC_ENABLED_ARG=
#ARG KC_TRACING_SAMPLER_TYPE_ARG=
#ARG KC_EVENT_METRICS_USER_ENABLED_ARG=
# ARG KC_FIPS_MODE_ARG=strict

ENV KC_DB=$KC_DB_ARG
#ENV KC_DB_DRIVER=$KC_DB_DRIVER_ARG
#ENV KC_TRANSACTION_XA_ENABLED=$KC_TRANSACTION_XA_ENABLED_ARG
#ENV KC_FEATURES=$KC_FEATURES_ARG
#ENV KC_FEATURES_DISABLED=$KC_FEATURES_DISABLED_ARG
#ENV KC_HTTP_RELATIVE_PATH=$KC_HTTP_RELATIVE_PATH_ARG
#ENV KC_HTTPS_CLIENT_AUTH=$KC_HTTPS_CLIENT_AUTH_ARG
ENV KC_HEALTH_ENABLED=$KC_HEALTH_ENABLED_ARG
#ENV KC_HTTP_MANAGEMENT_RELATIVE_PATH=$KC_HTTP_MANAGEMENT_RELATIVE_PATH_ARG
#ENV KC_HTTPS_MANAGEMENT_CLIENT_AUTH=$KC_HTTPS_MANAGEMENT_CLIENT_AUTH_ARG
ENV KC_METRICS_ENABLED=$KC_METRICS_ENABLED_ARG
#ENV KC_VAULT=$KC_VAULT_ARG
#ENV KC_TRACING_ENABLED=$KC_TRACING_ENABLED_ARG
#ENV KC_TRACING_JDBC_ENABLED=$KC_TRACING_JDBC_ENABLED_ARG
#ENV KC_TRACING_SAMPLER_TYPE=$KC_TRACING_SAMPLER_TYPE_ARG
#ENV KC_EVENT_METRICS_USER_ENABLED=$KC_EVENT_METRICS_USER_ENABLED_ARG
# ENV KC_FIPS_MODE=$KC_FIPS_MODE_ARG

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.1.2-0 AS runtime
COPY --from=ubi-micro-build /mnt/rootfs /
COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY ./auth-entrypoint.sh /auth-entrypoint.sh
COPY ./auth-healthcheck.sh /healthcheck.sh
USER keycloak
CMD [ "start-dev", "--import-realm", "--optimized" ]
ENTRYPOINT ["/auth-entrypoint.sh"]

FROM runtime AS dev

#this container does not need to run for testcoverage
FROM runtime AS testcoverage
CMD [ ]
ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM runtime AS staging

FROM runtime AS prod
