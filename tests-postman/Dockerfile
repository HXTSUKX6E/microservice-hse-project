# Используйте базовый образ Node.js
FROM node:17

# Установите рабочую директорию
WORKDIR /app

# Скопируйте файлы вашего приложения
COPY . .

# Установите зависимости
RUN npm install

# Установите Newman
RUN npm install -g newman

# Запустите тесты Postman
CMD ["newman", "run", "./tests-postman/Web_back.postman_collection.json"]