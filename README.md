### MuTraPro - Microservices

Dự án gồm nhiều service (Node.js, Spring Boot, Django) kết nối chung SQL Server và RabbitMQ, khởi chạy qua Docker Compose. Tích hợp Apache NiFi để quản lý và xử lý luồng dữ liệu giữa các microservices.

---

### Yêu cầu

- Docker Desktop 4.x (kèm Docker Compose)
- RAM tối thiểu 8GB (SQL Server + nhiều service + NiFi)
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
nifi/                            # Apache NiFi integration
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

- NiFi:
  - `SINGLE_USER_CREDENTIALS_USERNAME=admin`
  - `SINGLE_USER_CREDENTIALS_PASSWORD=AdminPass123456`

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

#### Khởi động với NiFi
Sử dụng script tự động:
```powershell
# Windows PowerShell
.\nifi\scripts\start-nifi.ps1

# hoặc thủ công:
```

1) Tắt/bỏ các volumes bind cho service Spring Boot trong `docker-compose.yml` (nếu đang có):
- order-service, media-service, notification-service, management-studio-service không được mount `./xxx:/app`.

2) Khởi động nền tảng (bao gồm NiFi)
```bash
docker-compose up -d sqlserver rabbitmq nifi
# Đợi SQL Server sẵn sàng (30-60s):
docker logs -f sqlserver
# Đợi NiFi sẵn sàng (1-2 phút):
docker logs -f nifi
```

3) Tải JDBC Driver cho NiFi (để kết nối SQL Server)
```powershell
.\nifi\scripts\download-jdbc-driver.ps1
# Sau đó restart NiFi:
docker-compose restart nifi
```

4) Tạo database (nếu chưa có)
```bash
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_User"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Order"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Media"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Notification"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_ManagementStudio"
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Strong@Pass123" -Q "CREATE DATABASE Mutrapro_Payment"
```
hoặc 
``` bash
CREATE DATABASE Mutrapro_User;
CREATE DATABASE Mutrapro_Order;
CREATE DATABASE Mutrapro_Media;
CREATE DATABASE Mutrapro_Notification;
CREATE DATABASE Mutrapro_ManagementStudio;
CREATE DATABASE Mutrapro_Payment;
```
5) Build images
```bash
docker-compose build
```

6) Khởi động các service
```bash
docker-compose up
# hoặc chạy nền:
# docker-compose up -d
```

7) Kiểm tra
- **NiFi UI**: https://localhost:8443/nifi (admin/AdminPass123456) - Xem `nifi/TRUY_CAP_NIFI.md` nếu gặp vấn đề
- API Gateway: http://localhost:8000
- Django user-service: http://localhost:8005
- RabbitMQ UI: http://localhost:15672 (guest/guest)
- SQL Server: localhost:1433 (sa/Strong@Pass123)

---

### Apache NiFi - Data Integration Platform

NiFi đã được tích hợp để xử lý và quản lý luồng dữ liệu giữa các microservices.

**Truy cập NiFi:**
- URL: **https://localhost:8443/nifi** (⚠️ Chú ý: HTTPS, không phải HTTP)
- Username: `admin`
- Password: `AdminPass123456`
- **Hướng dẫn truy cập**: Xem file `nifi/TRUY_CAP_NIFI.md`

**Tài liệu:**
- Hướng dẫn chi tiết: Xem file `nifi/docs/NIFI_SETUP.md`
- Tham khảo nhanh: Xem file `nifi/docs/NIFI_QUICK_REFERENCE.md`
- Ví dụ flow: Xem thư mục `nifi/templates/`

**Use Cases:**
- Event-driven order processing
- Database ETL và synchronization
- REST API orchestration
- Real-time monitoring và alerts
- File processing pipelines

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
- restart service
```bash
docker-compose up -d --build user-service
```
tạo tk admin trong user service
```bash
docker exec -it user-service python manage.py createsuperuser
```
---


---

### Lưu ý QUAN TRỌNG trước khi chạy

- Không bind mount source code vào các service Spring Boot (order/media/notification/management-studio). Nếu bạn mount `./service:/app`, file `app.jar` trong image sẽ bị che mất → lỗi “Unable to access jarfile app.jar”.
- `user-service` (Django) dùng SQL Server qua ODBC:
  - Dockerfile đã cài `msodbcsql17`
  - Trong `user-service/userService/userService/settings.py` cần `driver: "ODBC Driver 17 for SQL Server"`.

