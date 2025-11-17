# Apache NiFi Setup Guide for MuTraPro

## Giới thiệu về NiFi trong MuTraPro Project

Apache NiFi đã được tích hợp vào project MuTraPro để xử lý và quản lý luồng dữ liệu giữa các microservices. NiFi cung cấp giao diện trực quan để thiết kế, theo dõi và quản lý data flows.

## Kiến trúc tích hợp

```
┌─────────────────────────────────────────────────────────┐
│                    Apache NiFi                          │
│  (Data Integration & Flow Management Platform)          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   RabbitMQ   │  │  SQL Server  │  │  REST APIs  │ │
│  │  Integration │  │  ETL Jobs    │  │  Calls      │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────┐
│   RabbitMQ     │  │  SQL Server  │  │ Microservices│
│   Message      │  │  Databases   │  │  (REST APIs) │
│   Broker       │  │              │  │              │
└────────────────┘  └──────────────┘  └──────────────┘
```

## Cấu hình đã thực hiện

### 1. Docker Compose Configuration

NiFi service đã được thêm vào `docker-compose.yml`:

- **Ports:**
  - `8080`: NiFi Web UI (HTTP)
  - `8443`: NiFi Web UI (HTTPS)
  - `10000`: Site-to-Site Protocol
  
- **Credentials:**
  - Username: `admin`
  - Password: `AdminPass123456`

- **Resources:**
  - JVM Heap: 512MB - 2GB
  - Persistent volumes for data, configs, logs

- **Network:**
  - Connected to `microservices-net`
  - Can communicate with all services

### 2. Thư mục cấu hình

```
MuTraPro/
├── nifi-templates/          # Flow templates
│   └── README.md           # Template usage guide
├── nifi-config/            # Connection configurations
│   ├── rabbitmq-connection.json
│   ├── database-connection.json
│   └── service-endpoints.json
└── nifi-extensions/        # Custom extensions & drivers
    └── drivers/           # JDBC drivers
```

### 3. Pre-configured Integrations

#### RabbitMQ Connection
- Host: `rabbitmq:5672`
- Credentials: guest/guest
- Pre-defined queues: payment, order, notification, media

#### SQL Server Databases
- Host: `sqlserver:1433`
- All 6 databases configured:
  - Mutrapro_Payment
  - Mutrapro_Order
  - Mutrapro_Notification
  - Mutrapro_Media
  - Mutrapro_User
  - Mutrapro_ManagementStudio

#### Microservices Endpoints
- Gateway: http://gateway:8000
- Payment: http://payment-service:4002
- Order: http://order-service:4001
- Notification: http://notification-service:4003
- Media: http://media-service:4004
- Management: http://management-studio-service:4005
- User: http://user-service:8000

## Cách sử dụng

### Khởi động NiFi

```bash
# Start all services including NiFi
docker-compose up -d

# Check NiFi status
docker logs nifi

# Wait for startup (1-2 minutes)
# Look for: "NiFi has started"
```

### Truy cập NiFi UI

1. Mở trình duyệt: http://localhost:8080/nifi
2. Đăng nhập:
   - Username: `admin`
   - Password: `AdminPass123456`

### Tạo Data Flow đơn giản

#### Ví dụ 1: RabbitMQ Message Logger

1. **Kéo processor "ConsumeAMQP"** vào canvas
   - Right-click → Configure
   - Properties:
     ```
     Host Name: rabbitmq
     Port: 5672
     User Name: guest
     Password: guest
     Queue: payment-queue
     ```
   - Apply

2. **Kéo processor "LogAttribute"** vào canvas
   - Configure log level: INFO

3. **Kết nối các processors**
   - Drag từ ConsumeAMQP đến LogAttribute
   - Chọn relationship: "success"

4. **Start processors**
   - Right-click mỗi processor → Start
   - Xem logs trong NiFi bulletin board

#### Ví dụ 2: Database Query to REST API

1. **ExecuteSQL processor**
   - Query SQL Server database
   - Configure DBCPConnectionPool controller service

2. **ConvertRecord processor**
   - Convert SQL results to JSON

3. **InvokeHTTP processor**
   - POST data to microservice API

4. **Kết nối và start flow**

## Use Cases phổ biến

### 1. Event-Driven Order Processing
```
Order Created (RabbitMQ) 
  → Validate Order Data
  → Call Payment Service
  → Update Order Status
  → Send Notification
  → Log to Database
```

### 2. Database Synchronization
```
Payment DB 
  → Extract New Transactions
  → Transform Data
  → Load to Analytics DB
  → Schedule: Every 5 minutes
```

### 3. API Orchestration
```
User Request
  → Get User Info (User Service)
  → Get Orders (Order Service)
  → Get Payments (Payment Service)
  → Aggregate Response
  → Return Combined Data
```

### 4. Real-time Monitoring
```
Monitor RabbitMQ Queues
  → Detect Payment Failures
  → Check Error Rate > Threshold
  → Send Alert Email
  → Log to Notification Service
```

### 5. File Processing
```
Media Upload Event
  → Download File
  → Validate Format
  → Resize/Optimize
  → Upload to Storage
  → Update Media Database
```

## Các tính năng chính của NiFi

### Data Provenance
- Theo dõi mọi data flow từ nguồn đến đích
- Audit trail đầy đủ
- Replay data khi cần thiết

### Back Pressure
- Tự động điều chỉnh tốc độ xử lý
- Ngăn chặn memory overflow
- Queue management thông minh

### Expression Language
- Dynamic routing based on content
- Data transformation inline
- Conditional logic

### Error Handling
- Automatic retry với backoff
- Dead letter queues
- Alert và notification

### Clustering
- High availability
- Load balancing
- Horizontal scaling (có thể mở rộng sau)

## Best Practices

### 1. Tổ chức Flow
- Sử dụng Process Groups để nhóm logic
- Đặt tên processors mô tả rõ ràng
- Comment cho các flows phức tạp

### 2. Performance
- Configure batch sizes appropriately
- Set concurrent tasks dựa trên load
- Monitor back pressure indicators

### 3. Error Handling
- Luôn configure failure relationships
- Log errors chi tiết
- Implement retry logic

### 4. Security
- Không hard-code credentials
- Sử dụng Parameter Contexts
- Enable SSL cho production

### 5. Monitoring
- Theo dõi bulletin board
- Set up alerts cho critical flows
- Monitor queue depths

## Troubleshooting

### NiFi không start
```bash
# Check logs
docker logs nifi

# Check memory
docker stats nifi

# Restart
docker-compose restart nifi
```

### Processor lỗi "Connection Refused"
- Verify service names (không dùng localhost)
- Check Docker network: `docker network inspect mutrapro_microservices-net`
- Ensure target service is running

### Database connection failed
- Download MSSQL JDBC driver
- Place in `nifi-extensions/drivers/`
- Restart NiFi

### Out of Memory
- Increase JVM heap in docker-compose.yml:
  ```yaml
  NIFI_JVM_HEAP_MAX: 4g
  ```

## SQL Server JDBC Driver Setup

NiFi cần JDBC driver để kết nối SQL Server:

```bash
# Download Microsoft JDBC Driver
# Visit: https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server

# Extract và copy file .jar vào:
MuTraPro/nifi-extensions/drivers/mssql-jdbc-12.4.0.jre11.jar

# Restart NiFi
docker-compose restart nifi
```

## Monitoring & Alerts

### NiFi Status Dashboard
- View trong UI: Summary → System Diagnostics
- Monitor:
  - Heap usage
  - Active threads
  - FlowFile repository
  - Content repository
  - Provenance repository

### Bulletins
- Real-time alerts trong UI
- Filter by severity: ERROR, WARNING, INFO
- Configure processors to generate bulletins

### Logging
- Logs location: Container `/opt/nifi/nifi-current/logs/`
- View logs: `docker logs nifi`
- Log levels configurable per component

## Advanced Features

### 1. Templates
- Export/Import flows as XML
- Share flows giữa các môi trường
- Version control cho flows

### 2. Controller Services
- Shared services giữa processors
- Connection pooling
- Credential management

### 3. Parameter Contexts
- Centralized configuration
- Environment-specific values
- Easy updates without changing flows

### 4. Record Processors
- High-performance data processing
- Schema-aware transformations
- Support nhiều formats: JSON, CSV, Avro, XML

### 5. Scripting
- ExecuteScript processor
- Support Python, JavaScript, Groovy
- Custom business logic

## Integration với CI/CD

### Export Flow
```bash
# Trong NiFi UI
Right-click Process Group → Download flow
# Lưu file XML vào git repository
```

### Version Control
```bash
# NiFi Registry (optional advanced setup)
# Automatically track flow changes
# Deploy flows across environments
```

## Performance Tuning

### JVM Settings
```yaml
NIFI_JVM_HEAP_INIT: 1g
NIFI_JVM_HEAP_MAX: 4g
```

### Repository Settings
- FlowFile Repository: SSD recommended
- Content Repository: Large disk space
- Provenance Repository: Configurable retention

### Processor Tuning
- Concurrent Tasks: Based on CPU cores
- Run Schedule: Milliseconds to hours
- Batch Size: Balance throughput vs latency

## Resources

### Documentation
- Official NiFi Docs: https://nifi.apache.org/docs.html
- Expression Language: https://nifi.apache.org/docs/nifi-docs/html/expression-language-guide.html
- User Guide: https://nifi.apache.org/docs/nifi-docs/html/user-guide.html

### Community
- Mailing Lists: https://nifi.apache.org/mailing_lists.html
- Stack Overflow: [apache-nifi]
- GitHub: https://github.com/apache/nifi

### Training
- NiFi Fundamentals
- Building Data Flows
- Administration and Operations

## Next Steps

1. **Khởi động NiFi**: `docker-compose up -d`
2. **Truy cập UI**: http://localhost:8080/nifi
3. **Import template** từ `nifi-templates/`
4. **Tạo first flow**: RabbitMQ consumer
5. **Monitor và optimize**

## Support

Nếu gặp vấn đề:
1. Check Docker logs
2. Review NiFi bulletin board
3. Verify network connectivity
4. Check configuration files in `nifi-config/`
