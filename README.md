### MuTraPro - Microservices

Dự án gồm nhiều service (Node.js, Spring Boot, Django) kết nối chung SQL Server và RabbitMQ, khởi chạy qua Docker Compose.

---

### Yêu cầu

- Docker Desktop 4.x (kèm Docker Compose)
- RAM tối thiểu 6GB (SQL Server + nhiều service)
- Windows: nên bật WSL2 trong Docker Desktop

---

### Cấu trúc thư mục
```
MuTraPro/
docker-compose.yml
gate-way/
payment-service/ (Node.js)
order-service/ (Spring Boot)
media-service/ (Spring Boot)
management-studio-service (Spring Boot)
notification-service/ (Spring Boot)
user-service/ (Django)
frontend/ (React)
```
---

### Biến môi trường

Một số service có `.env` riêng (nếu chưa có, tạo theo mẫu dưới). Mặc định `docker-compose.yml` đã set sẵn hầu hết biến quan trọng.

- SQL Server (trong docker-compose):
  - `SA_PASSWORD=Strong@Pass123`
  - `ACCEPT_EULA=Y`

- RabbitMQ:
  - `RABBITMQ_DEFAULT_USER=guest`
  - `RABBITMQ_DEFAULT_PASS=guest`

- Django user-service (nếu cần `.env`):
```
DJANGO_SETTINGS_MODULE=userService.settings
DB_ENGINE=mssql
DB_HOST=sqlserver
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=Strong@Pass123
DB_NAME=Mutrapro_User
```

- Gateway
```
PORT=8000
PAYMENT_SERVICE_URL=http://payment-service:4002
```

---

### Lưu ý QUAN TRỌNG trước khi chạy

- Không bind mount source code vào các service Spring Boot (order/media/notification/management-studio). Nếu bạn mount `./service:/app`, file `app.jar` trong image sẽ bị che mất → lỗi “Unable to access jarfile app.jar”.
- `user-service` (Django) dùng SQL Server qua ODBC:
  - Dockerfile đã cài `msodbcsql17`
  - Trong `user-service/userService/userService/settings.py` cần `driver: "ODBC Driver 17 for SQL Server"`.

---

### Chạy nhanh (Quick Start)
lưu ý FE và payment service 
```bash
npm install
```
1) Tắt/bỏ các volumes bind cho service Spring Boot trong `docker-compose.yml` (nếu đang có):
- order-service, media-service, notification-service, management-studio-service không được mount `./xxx:/app`.

2) Khởi động nền tảng
```bash
docker-compose up -d sqlserver rabbitmq
# Đợi SQL Server sẵn sàng (30-60s):
docker logs -f sqlserver
```

3) Tạo database (nếu chưa có)
```bash
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_User"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Order"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Media"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Notification"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_ManagementStudio"
```

4) Build images
```bash
docker-compose build
```

5) Khởi động các service
```bash
docker-compose up
# hoặc chạy nền:
# docker-compose up -d
```

6) Kiểm tra
- API Gateway: http://localhost:8000
- Django user-service: http://localhost:8005
- RabbitMQ UI: http://localhost:15672 (guest/guest)
- SQL Server: localhost:1433 (sa/Strong@Pass123)

---

### Câu lệnh hữu ích

- Dừng/xóa tất cả
```bash
docker-compose down
```

- Xóa image/dangling data (cẩn thận)
```bash
docker system prune -f
```

- Xem log một service
```bash
docker logs -f user-service
```

---


---

### Lưu ý QUAN TRỌNG trước khi chạy

- Không bind mount source code vào các service Spring Boot (order/media/notification/management-studio). Nếu bạn mount `./service:/app`, file `app.jar` trong image sẽ bị che mất → lỗi “Unable to access jarfile app.jar”.
- `user-service` (Django) dùng SQL Server qua ODBC:
  - Dockerfile đã cài `msodbcsql17`
  - Trong `user-service/userService/userService/settings.py` cần `driver: "ODBC Driver 17 for SQL Server"`.

