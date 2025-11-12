# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
# copy file trước để tận dụng cache dependency
COPY pom.xml .
RUN mvn -B -e -DskipTests dependency:go-offline

# copy source và build
COPY src ./src
RUN mvn -B -e -DskipTests clean package

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
# copy file jar đã build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 4003
ENTRYPOINT ["java","-jar","app.jar"]
