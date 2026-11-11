# Бэкенд (Spring Boot + Gradle). Контекст сборки — КОРЕНЬ проекта (см. docker-compose.yaml).
# Версия Java должна совпадать с build.gradle (sourceCompatibility / toolchain):
#   docker build --build-arg JAVA_VERSION=17 ...
ARG JAVA_VERSION=21

# ---- сборка jar ----
FROM eclipse-temurin:${JAVA_VERSION}-jdk AS build
WORKDIR /workspace

COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

# слой с зависимостями кэшируется, пока не меняется build.gradle
RUN ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

COPY src src
RUN ./gradlew --no-daemon bootJar -x test

# ---- запуск ----
FROM eclipse-temurin:${JAVA_VERSION}-jre
WORKDIR /app
COPY --from=build /workspace/build/libs/*.jar app.jar

# Не root. UID/GID переопределяются в compose (user:), чтобы совпасть с владельцем ./data на хосте.
USER 1000:1000

# Память считается от лимита контейнера (mem_limit в compose)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"

EXPOSE 1488
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
