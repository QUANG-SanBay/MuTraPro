# -------------------- BUILD STAGE -------------------- #
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .

# Cho phép chạy mvnw (tránh lỗi permission)
RUN chmod +x ./mvnw

# Debug: List files before build
RUN ls -la

# Build project và tạo file jar với verbose output
RUN ./mvnw clean package -DskipTests -X

# Debug: List target directory after build
RUN ls -la target/

# -------------------- RUNTIME STAGE -------------------- #
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file jar được build ra từ stage build
COPY --from=build /app/target/*.jar app.jar

# Debug: List files in runtime
RUN ls -la

EXPOSE 4001
ENTRYPOINT ["java", "-jar", "app.jar"]