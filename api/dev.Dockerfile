FROM eclipse-temurin:21-jdk-alpine

WORKDIR /api

COPY --chmod=755 mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

COPY pom.xml .

RUN ./mvnw -q -DskipTests dependency:resolve dependency:resolve-plugins

COPY src ./src
