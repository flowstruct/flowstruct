FROM node:21-slim AS client
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /client
COPY /client .

FROM client AS cms
RUN --mount=type=cache,id=deps-cms,target=/pnpm/store \
	pnpm --filter cms install --frozen-lockfile
RUN pnpm --filter cms build

FROM client AS content
RUN --mount=type=cache,id=deps-content,target=/pnpm/store \
	pnpm --filter content install --frozen-lockfile --shamefully-hoist

FROM eclipse-temurin:21-jdk AS api
WORKDIR /api

COPY --chmod=755 api/mvnw ./
COPY /api/.mvn .mvn
COPY /api/pom.xml ./

RUN --mount=type=cache,id=maven-deps,target=/root/.m2/repository \
	./mvnw dependency:go-offline -B

COPY /api/src ./src
COPY --from=cms /client/apps/cms/dist/ ./src/main/resources/static/

RUN --mount=type=cache,id=maven-deps,target=/root/.m2/repository \
	./mvnw clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache npm caddy curl openssl gosu bash

COPY --from=api /api/target/*.jar ./app.jar

COPY --from=content /client/apps/content/package.json ./content/
COPY --from=content /client/apps/content/src/ ./content/src/
COPY --from=content /client/apps/content/astro.config.mjs ./content/
COPY --from=content /client/apps/content/tailwind.config.mjs ./content/
COPY --from=content /client/node_modules/ ./content/node_modules/

COPY /scripts/docker/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

COPY /reverse-proxy/ ./reverse-proxy/

ENV SPRING_PROFILES_ACTIVE=prod
ENV SITE_GENERATOR_DIR=content
ENV SITE_GENERATOR_SCRIPT="npm run build"
ENV SITE_GENERATOR_ICON_PATH=/app/content/src/assets/logo.png

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=60s \
	CMD curl -f http://localhost:8080/actuator/health || exit 1

CMD ["/bin/sh", "-c", "/app/entrypoint.sh"]
