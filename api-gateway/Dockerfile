# Используем официальный образ OpenJDK
FROM eclipse-temurin:17-jdk-jammy

# Рабочая директория
WORKDIR /app

# Копируем собранный JAR-файл
COPY demo/target/api-gateway.jar app.jar

# Открываем порт, который использует Gateway
EXPOSE 8082

# Команда для запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]