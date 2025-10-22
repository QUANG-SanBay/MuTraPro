### MuTraPro - Microservices

Dự án gồm nhiều service (Node.js, Spring Boot, Django) sử dụng chung SQL Server và RabbitMQ, khởi chạy qua Docker Compose.

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
  payment-service/            (Node.js)
  order-service/              (Spring Boot)
  media-service/              (Spring Boot)
  management-studio-service/  (Spring Boot)
  notification-service/       (Spring Boot)
  user-service/               (Django)
  frontend/                   (React)
```

---

### Biến môi trường

Một số service có `.env` riêng (nếu chưa có, tạo theo mẫu). Phần lớn env đã đặt sẵn trong `docker-compose.yml`.

- SQL Server:
  - `SA_PASSWORD=Strong@Pass123`
  - `ACCEPT_EULA=Y`

- RabbitMQ:
  - `RABBITMQ_DEFAULT_USER=guest`
  - `RABBITMQ_DEFAULT_PASS=guest`

- user-service (Django) – file `.env` (tuỳ chọn):
```
DJANGO_SETTINGS_MODULE=userService.settings
DB_ENGINE=mssql
DB_HOST=sqlserver
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=Strong@Pass123
DB_NAME=Mutrapro_User
```

- Gateway – file `.env` (ví dụ):
```
PORT=8000
PAYMENT_SERVICE_URL=http://payment-service:4002
```

---

### Lưu ý quan trọng

- KHÔNG bind-mount source vào các service Spring Boot (order/media/notification/management-studio). Nếu mount `./service:/app`, file JAR trong image sẽ bị che → lỗi “Unable to access jarfile app.jar”.
- user-service (Django) dùng ODBC 17:
  - Dockerfile cài `msodbcsql17` (ODBC Driver 17)
  - `user-service/userService/userService/settings.py` phải dùng `"ODBC Driver 17 for SQL Server"` trong `OPTIONS.driver`.

---

### Chạy nhanh (Quick Start)

1) Đảm bảo không có volumes bind cho các service Spring Boot trong `docker-compose.yml`.

2) Khởi động nền tảng
```bash
docker-compose up -d sqlserver rabbitmq
# Đợi SQL Server sẵn sàng (30–60s):
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

6) Truy cập nhanh
- Gateway: http://localhost:8000
- user-service (Django): http://localhost:8005
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- SQL Server: localhost:1433 (sa/Strong@Pass123)

---

### Gợi ý cấu hình chờ (tùy chọn)

- Đợi SQL Server sẵn sàng trước khi start các service phụ thuộc:
```yaml
depends_on:
  sqlserver:
    condition: service_healthy
  rabbitmq:
    condition: service_started
```

- Healthcheck SQL Server (đi kèm trong compose):
```yaml
healthcheck:
  test: ["CMD", "/opt/mssql-tools/bin/sqlcmd", "-S", "localhost", "-U", "sa", "-P", "Strong@Pass123", "-Q", "SELECT 1"]
  interval: 10s
  retries: 10
  timeout: 5s
  start_period: 30s
```

- user-service có thể dùng script chờ rồi mới migrate (tuỳ chọn):
```bash
# wait-for-sqlserver.sh
until /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P "Strong@Pass123" -Q "SELECT 1" > /dev/null 2>&1; do
  sleep 2
done
python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000
```

---

### Câu lệnh hữu ích

- Dừng/xoá tất cả
```bash
docker-compose down
```

- Xoá image/dangling data (cẩn thận)
```bash
docker system prune -f
```

- Xem log một service
```bash
docker logs -f user-service
```

---

### Khắc phục sự cố (Troubleshooting)

- “Unable to access jarfile app.jar” (Spring Boot)
  - Đang mount `./<service>:/app` → che mất file JAR. Gỡ volumes bind, build và chạy lại.

- Django: “Can't open lib 'ODBC Driver 17 for SQL Server'”
  - Cài ODBC 18 nhưng settings dùng driver 17 (hoặc ngược lại). Đồng bộ: Dockerfile cài `msodbcsql17` và `OPTIONS.driver = "ODBC Driver 17 for SQL Server"`.

- Django: “Login timeout expired”
  - SQL Server chưa sẵn sàng hoặc database chưa tồn tại. Đợi healthcheck OK và tạo DB như Quick Start.

- RabbitMQ “system_memory_high_watermark”
  - Cảnh báo bộ nhớ. Có thể thêm env `RABBITMQ_VM_MEMORY_HIGH_WATERMARK=0.6` hoặc tăng RAM cho Docker.

---

### Ghi chú phát triển

- Node services (gateway, payment-service) có thể bind-mount để hot-reload:
```yaml
volumes:
  - ./payment-service:/app
  - ./gate-way:/app
```

- Spring Boot:
  - Chế độ sản xuất: chạy JAR, không bind-mount.
  - Chế độ dev: có thể dùng `mvn spring-boot:run` và bind-mount source (cần điều chỉnh Dockerfile/compose).

- Django:
  - Có thể bind-mount `./user-service:/app` khi dev, nhưng phải giữ đúng ODBC driver và chờ SQL Server trước khi migrate.

---

Nội dung dự án phục vụ mục đích học tập và demo nội bộ.