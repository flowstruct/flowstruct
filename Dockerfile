# -------------------------
# node pnpm workspace
# -------------------------
FROM node:21-slim AS client-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /build/client

COPY /client .

FROM client-base AS cms
RUN --mount=type=cache,id=deps-cms,target=/pnpm/store pnpm --filter cms install --frozen-lockfile

RUN pnpm --filter cms run build

FROM client-base AS content

# -------------------------
# api build
# -------------------------
FROM eclipse-temurin:21-jdk AS api
WORKDIR /build/api

COPY --chmod=755 api/mvnw ./
COPY /api/.mvn .mvn

COPY /api/pom.xml ./
RUN ./mvnw dependency:go-offline -B

COPY /api/src ./src
COPY --from=cms /build/client/apps/cms/dist/ ./src/main/resources/static/

RUN ./mvnw clean package -DskipTests -B

# -------------------------
# final runtime: Java + Node + Caddy (Alpine)
# -------------------------
FROM alpine AS runtime
WORKDIR /app

RUN apk add --no-cache openjdk21-jre nodejs caddy curl openssl gosu

COPY --from=api-build /build/api/target/*.jar ./app.jar
COPY --from=client-build /build/client/apps/content/dist/ ./content/

COPY /scripts/docker/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

COPY /reverse-proxy/ ./reverse-proxy/

ENV SPRING_PROFILES_ACTIVE=prod
ENV NODE_ENV=production
ENV PORT=4321

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

CMD ["/bin/sh", "-c", "/app/entrypoint.sh"]
