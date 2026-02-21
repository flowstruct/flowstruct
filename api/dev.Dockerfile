FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:resolve dependency:resolve-plugins
