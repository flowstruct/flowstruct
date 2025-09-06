# -------------------------
# node pnpm workspace (build cms & content)
# -------------------------
FROM node:20-slim AS client-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM client-base AS client-build
WORKDIR /build/client

COPY /client .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run -r build

# -------------------------
# api build
# -------------------------
FROM eclipse-temurin:21-jdk AS api-base
WORKDIR /build/api

COPY --chmod=755 api/mvnw ./
COPY /api/.mvn .mvn

COPY /api/pom.xml ./
RUN ./mvnw dependency:go-offline -B

FROM api-base AS api-build
WORKDIR /build/api

COPY /api/src ./src
COPY --from=client-build /build/client/apps/cms/dist/ ./src/main/resources/cms/

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
