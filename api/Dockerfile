FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /build/
COPY pom.xml /build/
RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline
COPY src /build/src/
RUN --mount=type=cache,target=/root/.m2 \
    mvn package -DskipTests -Djacoco.skip=true

#Run maven tests (Unit)
FROM build AS mvn-test
CMD ["mvn", "clean", "test", "-Djacoco.skip=true"]

#Run maven tests (Integration)
FROM build AS mvn-verify
CMD ["mvn", "clean", "verify", "-Dskip.ut=true", "-Djacoco.skip=true"]

#Run maven tests (Unit and Integration)
FROM build AS mvn-test-all
CMD ["mvn", "clean", "verify", "-Djacoco.skip=true"]

#Run maven tests (Unit and Integration) with coverage
FROM mvn-test-all AS testcoverage
CMD ["mvn", "clean", "verify"]

FROM eclipse-temurin:21.0.6_7-jre-alpine-3.21 AS runtime
# needed for healthcheck
RUN apk add --no-cache curl coreutils

WORKDIR /
ENV SPRING_PROFILES_ACTIVE=prod
COPY --from=build /build/target/*.jar /api.jar
COPY ./api-entrypoint.sh /api-entrypoint.sh
COPY ./api-healthcheck.sh /healthcheck.sh
COPY ./api-init.sh /api-init.sh
RUN mkdir /tmp/tomcat static
EXPOSE 8080 
RUN addgroup api_group --gid 8000
RUN adduser -D api_user api_group
RUN chown -R api_user:api_group /api.jar
RUN chown -R api_user:api_group /api-entrypoint.sh
RUN chown -R api_user:api_group /healthcheck.sh
RUN chown -R api_user:api_group /api-init.sh
USER api_user
# Run the api
ENTRYPOINT [ "/api-entrypoint.sh" ]

#Developer runtime (extension of production runtime)
FROM runtime AS dev
ENV SPRING_PROFILES_ACTIVE=dev

#Test runtime (extension of production runtime)
FROM runtime AS staging
ENV SPRING_PROFILES_ACTIVE=test

#Production runtime 
FROM runtime AS prod
