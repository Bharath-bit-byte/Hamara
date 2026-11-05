# =============================================================================
# HamaraShops.ai - Monolithic Backend Multi-Stage Container Build
# Target Architecture: Google Cloud Run / Containerized Environments
# Runtime: Eclipse Temurin OpenJDK 21 JRE Alpine (Lightweight & Secure)
# =============================================================================

# Stage 1: Build & Package Artifact
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source tree and compile package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Distroless / Alpine Production JRE Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Ensure application user is non-root for enhanced container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Google Cloud Run dynamically injects $PORT (defaults to 8080)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=cloud

COPY --from=builder --chown=appuser:appgroup /app/target/hamarashops-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
