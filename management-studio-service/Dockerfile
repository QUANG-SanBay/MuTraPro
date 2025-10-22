# -------------------- BUILD STAGE -------------------- #
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .

# Cho phép chạy mvnw (tránh lỗi permission)
RUN chmod +x ./mvnw

# Build project và tạo file jar
RUN ./mvnw clean package -DskipTests

# -------------------- RUNTIME STAGE -------------------- #
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file jar được build ra từ stage build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 4005
ENTRYPOINT ["java", "-jar", "app.jar"]
