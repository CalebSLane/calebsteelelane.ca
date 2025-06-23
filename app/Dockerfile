FROM node:23.8.0-alpine3.21 AS setup
RUN apk add --no-cache curl 
WORKDIR /app
RUN chown -R node:node /app
COPY package*.json ./
RUN mkdir -p /app/node_modules/
RUN chown -R node:node /app/node_modules/
USER node
RUN --mount=type=cache,target=/root/.npm npm ci
USER root
COPY ./public ./public
COPY ./src ./src
RUN chown -R node:node /app/src/
RUN chown -R node:node /app/public/
USER node

FROM setup AS build
RUN npm run build

#Developer runtime 
FROM setup AS dev
#this allows us to run the container as a non-root user with fewer capabilities by using non-privileged ports
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]

FROM build AS npm-test
CMD ["npm", "test"]

#Run npm tests with coverage
FROM npm-test AS testcoverage
CMD ["npm", "test", "--", "--coverage"]

FROM nginx:1.27.4-alpine-slim AS runtime
# needed for healthcheck
RUN apk add --no-cache curl 
#removing user directive since we're running the container as non-root
RUN sed -i 's,user  nginx;,,' /etc/nginx/nginx.conf
#this allows us to mount just the pid file as a tmpfs that is writeable 
RUN sed -i 's,/var/run/nginx.pid,/var/run/nginx/nginx.pid,' /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./app-healthcheck.sh /healthcheck.sh
RUN chown -R nginx:nginx /healthcheck.sh
RUN chown -R nginx:nginx /etc/nginx/conf.d/default.conf
#this allows us to run the container as a non-root user with fewer capabilities by using non-privileged ports
EXPOSE 8080
USER nginx
CMD ["nginx", "-g", "daemon off;"]

#Test runtime 
FROM runtime AS staging

#default to production runtime
FROM runtime AS prod