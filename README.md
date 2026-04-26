# Microservice HSE Project

Монорепозиторий с микросервисной системой для платформы вакансий/резюме.

## Состав проекта

- **auth-service** (Spring Boot, порт `8080`) — регистрация, авторизация, JWT, профиль, восстановление пароля, работа с резюме и изображениями резюме.
- **company-vacancy-service** (Spring Boot, порт `8083`) — компании, вакансии, отклики.
- **notification-service** (Spring Boot, порт `8081`) — email-уведомления, потребляет события из Kafka.
- **nginx** (порт `80`) — reverse proxy к backend API.
- **frontend/my-app** (Next.js) — веб-интерфейс (запускается отдельно, в `docker-compose` не подключён).
- Инфраструктура: **PostgreSQL (2 БД), Redis, Kafka + Zookeeper, Graylog + Elasticsearch + MongoDB, pgAdmin**.

## Архитектура и взаимодействие

1. Клиент обращается в `nginx`.
2. `nginx` проксирует запросы:
   - `/api/auth/*` и `/api/user/*` → `auth-service`
   - `/api/comp-vac/*` → `company-vacancy-service`
3. `auth-service` и `company-vacancy-service` работают с PostgreSQL и JWT.
4. Сервисы публикуют события в Kafka (регистрация, смена email, отклики).
5. `notification-service` подписывается на Kafka-топики и отправляет email.
6. Redis используется для хранения служебных данных (например, blacklist токенов).

## Основные API

### Auth Service (`/api/auth`)

- `POST /api/auth/register` — регистрация.
- `GET /api/auth/confirm?token=...` — подтверждение аккаунта.
- `POST /api/auth/login` — вход.
- `POST /api/auth/logout` — выход.
- `GET /api/auth/profile` — получить профиль текущего пользователя.
- `PUT /api/auth/profile` — обновить профиль.
- `PUT /api/auth/profile/change-login` — смена email/login.
- `GET /api/auth/confirm-email-change?token=...` — подтверждение смены email.
- `POST /api/auth/forgot-password` — запрос восстановления пароля.
- `POST /api/auth/confirm-reset-password?token=...` — установка нового пароля.

### Resume API (`/api/user`)

- `POST /api/user/resume` — создать резюме.
- `GET /api/user/resume/{id}` — получить резюме.
- `GET /api/user/resume` — список резюме (роль-зависимо).
- `PUT /api/user/resume/{id}` — обновить резюме.
- `DELETE /api/user/resume/{id}` — удалить резюме.
- `POST /api/user/{resumeId}/image` — загрузить изображение.
- `GET /api/user/resume-image/{resumeId}/content` — получить контент изображения.
- `GET /api/user/{resumeId}/images/content` — получить presigned URL изображений.
- `DELETE /api/user/resume-image/{resumeImageId}/content` — удалить изображение.

### Company/Vacancy Service (`/api/comp-vac`)

#### Компании
- `GET /api/comp-vac/company`
- `POST /api/comp-vac/company`
- `GET /api/comp-vac/company/{id}`
- `PUT /api/comp-vac/company/{id}`
- `PUT /api/comp-vac/company-accept/{id}`
- `DELETE /api/comp-vac/company/{id}`
- `GET /api/comp-vac/my-company`
- `PUT /api/comp-vac/my-company/{id}`
- `DELETE /api/comp-vac/my-company/{id}`

#### Вакансии
- `GET /api/comp-vac/vacancy`
- `GET /api/comp-vac/vacancy/{id}`
- `GET /api/comp-vac/my-vacancy`
- `GET /api/comp-vac/admin/vacancy`
- `POST /api/comp-vac/vacancy`
- `PUT /api/comp-vac/vacancy/{id}`
- `DELETE /api/comp-vac/vacancy/{id}`

#### Отклики
- `POST /api/comp-vac/vacancy/{id}/response`
- `GET /api/comp-vac/responses`
- `GET /api/comp-vac/responses/{id}`

## Kafka-топики

`notification-service` слушает следующие топики:

- `user-registration`
- `user-change-event`
- `user-forgot-event`
- `response-notifications`

## Быстрый запуск (Docker Compose)

### 1) Предварительная сборка JAR

Из корня репозитория:

```bash
cd auth-service/demo && ./mvnw clean package && cd ../..
cd company-vacancy-service/demo && ./mvnw clean package && cd ../..
cd notification-service/demo && ./mvnw clean package && cd ../..
```

### 2) Поднять инфраструктуру и сервисы

```bash
docker compose up --build -d
```

### 3) Проверка

- API через nginx: `http://localhost/api/auth/...`, `http://localhost/api/comp-vac/...`
- Notification-service: `http://localhost:8081`
- pgAdmin: `http://localhost:5050` (admin@admin.com / admin)
- Graylog: `http://localhost:9000`

## Локальный запуск без Docker

### Backend
Для каждого сервиса:

```bash
cd <service>/demo
./mvnw spring-boot:run
```

По умолчанию порты:
- `auth-service` → `8080`
- `company-vacancy-service` → `8083`
- `notification-service` → `8081`

### Frontend

```bash
cd frontend/my-app
npm install
npm run dev
```

Frontend доступен на `http://localhost:3000`.

## Переменные окружения и секреты

Для `auth-service` используются переменные Yandex Object Storage из `.env`:

- `YC_ACCESS_KEY`
- `YC_SECRET_KEY`
- `YC_BUCKET_NAME`
- `YC_REGION`

## Технологии

- Java 17, Spring Boot 3.x, Spring Security, Spring Data JPA
- PostgreSQL, Redis
- Apache Kafka, Zookeeper
- Nginx
- Next.js 15, React 19, TypeScript
- Graylog + Elasticsearch + MongoDB

## Структура каталогов

```text
.
├── auth-service/
│   └── demo/                # Spring Boot auth + resume
├── company-vacancy-service/
│   └── demo/                # Spring Boot companies + vacancies + responses
├── notification-service/
│   └── demo/                # Kafka consumers + email notifications
├── frontend/
│   └── my-app/              # Next.js frontend
├── nginx/
├── postgres-init/
├── docker-compose.yml
└── build.bat
```
