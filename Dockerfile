# ===== Stage 1: build the React frontend =====
FROM node:22-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_URL=http://localhost:8081
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ===== Stage 2: build the Spring Boot backend (frontend files go inside it) =====
FROM eclipse-temurin:25-jdk AS backend-build
WORKDIR /backend
COPY veterinary-backend/ ./
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw clean package -DskipTests

# ===== Stage 3: final single image =====
FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY --from=backend-build /backend/target/*.jar app.jar
ENV SERVER_PORT=8081
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]