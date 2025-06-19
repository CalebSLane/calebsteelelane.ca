This is a project for a full stack application with a focus on automated processes to help many key processes that should be involved in any project. All of these processes have competitors in their space that could be used instead, but before removing components ensure that an alternative is first created.

In particular this csl-project tries to cover:

Hooks (Husky)

Code Styling (Prettier)

Linting (Checkstyle, ESLint)

Build Automation (Maven, Docker)

Testing (JUnit, Cypress, Jest)

Coverage (Jacoco. Jest)

Documentation (JavaDocs)

Containerization (Docker)

In future it should also cover:

Continuous Integration (GitHub Actions)

Security Scanning (Dependabot, Snyk)

Monitoring (Grafana, Loki)

Backup

Other technologies in this project are:

Spring Boot
NGINX
React.js
Postgres
Keycloak

Principles this project aligns with are:

Secure by default
Variable reuse
Caching builds

Security principles:
minimal docker images
run containers as a non-root user
hardened containers
healthchecks

To get started with a dev environment run sudo ./scripts/initial-startup-dev.sh

To get started with a production environment run sudo ./scripts/initial-startup.sh
