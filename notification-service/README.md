# MuTraPro - Microservices System

Hệ thống MuTraPro là nền tảng phối khí và thu âm theo yêu cầu, được phát triển theo kiến trúc Microservices.
Các service (Node.js, Spring Boot, Django, React, SQL Server, RabbitMQ, Apache NiFi) được container hóa bằng Docker Compose.
---

## Yêu cầu hệ thống

Docker Desktop 4.x (bao gồm Docker Compose)

RAM tối thiểu 6GB (SQL Server + nhiều service đồng thời)

Windows: nên bật WSL2 để đảm bảo hiệu năng

Công cụ khuyến nghị: VSCode, IntelliJ IDEA, Postman, Docker Desktop, DBeaver
---

## Cấu trúc thư mục dự án
notification-service/
│  ├─ Dockerfile
│  ├─ pom.xml
│  └─ src/main/java/com/mutrapro/notification/
│     ├─ config/
│     │  ├─ RabbitMQConfig.java
│     │  ├─ WebSocketConfig.java
│     │  └─ GlobalExceptionHandler.java
│     ├─ controller/
│     │  └─ NotificationController.java
│     ├─ dto/
│     │  └─ NotificationPayload.java
│     ├─ entity/
│     │  └─ Notification.java
│     ├─ repository/
│     │  └─ NotificationRepository.java
│     ├─ service/
│     │  └─ NotificationService.java
│     └─ messaging/
│        └─ NotificationListener.java
---

## Gateway (gate-way/)
 ### Chức năng

Là API Gateway trung gian giữa Frontend và các Backend Service.

Quản lý CORS, Rate Limiting, Logging, Error Handling, và Routing đến các service khác.

Các middleware chính
Tên file	Vai trò
cors-config.js	Cấu hình CORS an toàn cho các domain được phép
logger.js	Log toàn bộ request đi qua gateway
error-handler.js	Xử lý lỗi chung (runtime, API error), Bắt lỗi 404.

### Gateway (Node.js) — gate-way/

Yêu cầu: Node.js ≥ 18, npm ≥ 9
cd gate-way

 Cài dependencies runtime
npm i express cors dotenv cookie-parser axios express-rate-limit morgan helmet

 (tuỳ chọn) nếu bạn muốn proxy HTTP đặc thù
 npm i http-proxy-middleware

 Dev-time (hot reload)
npm i -D nodemon

### Scripts khuyến nghị trong gate-way/package.json:
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "lint": "echo \"(optional) add eslint here\""
  }
}

## Biến môi trường
PORT=8000
CORS_ORIGINS=http://localhost:3000

PAYMENT_SERVICE_URL=http://payment-service:4002
ORDER_SERVICE_URL=http://order-service:4001
NOTIFICATION_SERVICE_URL=http://notification-service:4003
MEDIA_SERVICE_URL=http://media-service:4004
MANAGEMENT_STUDIO_SERVICE_URL=http://management-studio-service:4005
USER_SERVICE_URL=http://user-service:8000

### Chạy Gateway:
npm run dev   # hot reload
# hoặc
npm start
---

## Frontend (React)
### Chức năng

Giao diện người dùng cho khách hàng và quản trị viên.

Giao tiếp với Gateway qua /api.

### Gồm các module:

ProductApproval (quản lý phê duyệt sản phẩm)

NotificationList (hiển thị thông báo)

DefaultLayout (bố cục giao diện tổng)

### Yêu cầu: Node.js ≥ 18

cd frontend

 Cài dependencies runtime
npm i react-router-dom axios react-icons classnames

 Bạn đang dùng *.module.scss → cần thêm Sass
npm i sass

 (tuỳ chọn) Nếu nhận thông báo realtime qua STOMP WebSocket:
npm i @stomp/stompjs sockjs-client

 (tuỳ chọn) format/lint
npm i -D prettier

### Scripts khuyến nghị trong frontend/package.json:
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,scss}\""
  }
}


### Nếu trước đây bạn dùng react-app-rewired mà bị lỗi
“react-app-rewired is not recognized”, hãy quay lại react-scripts như trên
(gỡ rewired khỏi package.json & cài react-scripts: npm i -D react-scripts nếu thiếu).

### Biến môi trường Frontend (frontend/.env.development):

 Gateway URL (local)
REACT_APP_API=http://localhost:8000/api

### Chạy Frontend:

npm start
 mở http://localhost:3000

Lưu ý router:

App của bạn đã dùng BrowserRouter trong App.js → OK cho dev/local.

Nếu deploy sau này sau reverse proxy/Nginx, nhớ cấu hình fallback /* về index.html
---

## Notification Service (notification-service/)
### Chức năng

Tiếp nhận và lưu thông báo từ các service khác thông qua RabbitMQ.

Cung cấp API để frontend lấy danh sách thông báo hoặc tạo mới.

Gửi dữ liệu WebSocket đến client theo thời gian thực.

Lưu trữ dữ liệu thông báo trong SQL Server.
---

## Infrastructure
### SQL Server

Dùng làm Database chính cho toàn hệ thống.

Được build sẵn với file Dockerfile và script khởi tạo init/.

### RabbitMQ

Dùng để truyền thông điệp bất đồng bộ giữa các service.

UI: http://localhost:15672

Username/Password mặc định: guest / guest

### Apache NiFi

Được dùng để ETL dữ liệu (trích xuất, chuyển đổi, tải) và tích hợp dòng dữ liệu tự động.

UI: http://localhost:8080/nifi

Dùng để kết nối dữ liệu từ:

RabbitMQ → Notification Service

SQL Server → file/Excel xuất báo cáo

hoặc đồng bộ dữ liệu giữa microservices
---

## Cách chạy hệ thống

### Build & Run
docker compose up -d

### Kiểm tra
| Service          | URL                                                                                | Mô tả                    |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| Gateway          | [http://localhost:8000](http://localhost:8000)                                     | API trung gian           |
| Frontend         | [http://localhost:3000](http://localhost:3000)                                     | React UI                 |
| Notification API | [http://localhost:4003/api/notifications](http://localhost:4003/api/notifications) | Service Java             |
| RabbitMQ UI      | [http://localhost:15672](http://localhost:15672)                                   | guest/guest              |
| NiFi UI          | [http://localhost:8080/nifi](http://localhost:8080/nifi)                           | Apache NiFi              |
| SQL Server       | `localhost:1433`                                                                   | sa / YourStrong!Passw0rd |

### Kiến trúc tổng thể
[ React UI ] 
     ↓
[ Gateway (Node.js) ]
     ↓
─────────────────────────────
| order-service      |
| payment-service    | → [ RabbitMQ ] → [ Notification Service ] → [ SQL Server ]
| media-service      |
| management-service |
─────────────────────────────
         ↓
 [ Apache NiFi ] → Xuất báo cáo, ETL dữ liệu

 ### Các lệnh hữu ích
 # build lại toàn bộ image
docker compose build --no-cache

# xem log service cụ thể
docker logs -f notification-service
docker logs -f gate-way
docker logs -f nifi

# dừng toàn bộ hệ thống
docker compose down

## Một số package đã dùng trong dự án (đối chiếu nhanh)
| Vị trí     | Gói                                          | Mục đích                    |
| ---------- | -------------------------------------------- | --------------------------- |
| `gate-way` | `express`                                    | web server                  |
|            | `cors`                                       | bật CORS an toàn            |
|            | `dotenv`                                     | nạp `.env`                  |
|            | `cookie-parser`                              | đọc cookie                  |
|            | `axios`                                      | forward request tới service |
|            | `express-rate-limit`                         | chống spam API              |
|            | `morgan`                                     | HTTP request logger         |
|            | `helmet`                                     | header bảo mật              |
|            | `nodemon` (dev)                              | hot reload                  |
| `frontend` | `react-router-dom`                           | routing                     |
|            | `axios`                                      | gọi Gateway                 |
|            | `react-icons`                                | icon UI                     |
|            | `classnames`                                 | className tiện lợi          |
|            | `sass`                                       | hỗ trợ `.scss`              |
|            | `@stomp/stompjs`, `sockjs-client` (tuỳ chọn) | STOMP WebSocket             |

---