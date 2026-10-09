FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY target/veterinary-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
