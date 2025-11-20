# NiFi Integration - Quick Reference

## Thông tin truy cập

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| NiFi UI | http://localhost:8080/nifi | admin | AdminPass123456 |
| NiFi HTTPS | https://localhost:8443/nifi | admin | AdminPass123456 |
| RabbitMQ | http://localhost:15672 | guest | guest |

## Kiến trúc tổng quan

```
┌──────────────────────────────────────────────────────────┐
│                     Apache NiFi                          │
│              (Port 8080, 8443, 10000)                    │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
      RabbitMQ (5672)  SQL Server    Microservices
             │         (1433)        (4001-4005, 8000)
             │              │              │
             ▼              ▼              ▼
    ┌───────────────┐ ┌─────────┐  ┌──────────────┐
    │  Message      │ │ 6 DBs   │  │ 7 Services   │
    │  Broker       │ │         │  │ + Gateway    │
    └───────────────┘ └─────────┘  └──────────────┘
```

## Các use case đã cấu hình

### 1. RabbitMQ Integration
- **ConsumeAMQP**: Lấy messages từ queues
- **PublishAMQP**: Gửi messages đến exchanges/queues
- **Queues**: payment, order, notification, media

### 2. Database Operations
- **ExecuteSQL**: Query dữ liệu
- **PutDatabaseRecord**: Insert/Update
- **6 databases**: Payment, Order, Notification, Media, User, Management

### 3. REST API Integration
- **InvokeHTTP**: Call microservices APIs
- **7 services**: Payment, Order, Notification, Media, Management, User, Gateway

### 4. Data Transformation
- **EvaluateJsonPath**: Parse JSON
- **ConvertRecord**: Transform formats
- **UpdateAttribute**: Modify metadata

### 5. Flow Control
- **RouteOnAttribute**: Conditional routing
- **RetryFlowFile**: Retry logic
- **MergeContent**: Aggregate data

## Các processors phổ biến

| Processor | Chức năng | Use case |
|-----------|-----------|----------|
| ConsumeAMQP | Consume RabbitMQ messages | Event-driven processing |
| PublishAMQP | Publish to RabbitMQ | Send events/notifications |
| InvokeHTTP | REST API calls | Microservice integration |
| ExecuteSQL | Query database | Read data |
| PutDatabaseRecord | Insert/Update DB | Write data |
| EvaluateJsonPath | Parse JSON | Extract fields |
| RouteOnAttribute | Conditional routing | Business logic |
| LogAttribute | Log data | Debugging |
| UpdateAttribute | Add/modify attributes | Metadata management |
| RetryFlowFile | Retry failed operations | Error recovery |

## Expression Language Examples

```
# Get current timestamp
${now():format('yyyy-MM-dd HH:mm:ss')}

# Extract JSON field
${message:jsonPath('$.orderId')}

# Check if attribute exists and not empty
${orderId:isEmpty():not()}

# Conditional logic
${amount:toNumber():gt(100)}

# String manipulation
${username:toLower()}
${filename:substringBefore('.')}

# Date operations
${timestamp:toDate('yyyy-MM-dd'):format('MM/dd/yyyy')}
```

## Connection Strings

### RabbitMQ
```
Host: rabbitmq
Port: 5672
Virtual Host: /
Username: guest
Password: guest
```

### SQL Server (Template)
```
jdbc:sqlserver://sqlserver:1433;databaseName=Mutrapro_[ServiceName];user=sa;password=Strong@Pass123;encrypt=false;trustServerCertificate=true
```

### Microservices (Template)
```
http://[service-name]:[port]/api/[endpoint]
```

## Common Workflows

### Event Processing Pipeline
```
ConsumeAMQP → EvaluateJsonPath → RouteOnAttribute → InvokeHTTP → PublishAMQP
```

### ETL Pipeline
```
ExecuteSQL → ConvertRecord → UpdateAttribute → PutDatabaseRecord
```

### API Orchestration
```
InvokeHTTP (Service A) → EvaluateJsonPath → InvokeHTTP (Service B) → MergeContent
```

### Error Handling Pattern
```
Processor → [Success] → Next Step
         → [Failure] → RetryFlowFile → [Max Retries] → PublishAMQP (Error Queue)
```

## Monitoring Checklist

- [ ] Check bulletin board for errors
- [ ] Monitor queue depths
- [ ] Track processor execution times
- [ ] Review data provenance
- [ ] Check system diagnostics (CPU, Memory, Disk)
- [ ] Verify connection pool health
- [ ] Monitor RabbitMQ queue sizes
- [ ] Check database connection status

## Commands

### Start NiFi
```powershell
# Windows
.\start-nifi.ps1

# Linux/Mac
./start-nifi.sh
```

### Download JDBC Driver
```powershell
.\download-jdbc-driver.ps1
```

### Docker Commands
```bash
# View logs
docker logs nifi

# Restart
docker-compose restart nifi

# Stop
docker-compose stop nifi

# Start
docker-compose start nifi

# Remove (careful!)
docker-compose down -v
```

## File Locations

```
MuTraPro/
├── docker-compose.yml          # NiFi service definition
├── NIFI_SETUP.md              # Detailed setup guide
├── start-nifi.ps1             # Quick start script (Windows)
├── start-nifi.sh              # Quick start script (Linux/Mac)
├── download-jdbc-driver.ps1   # JDBC driver download
├── nifi-templates/            # Flow templates and examples
│   ├── README.md
│   └── ORDER_PROCESSING_EXAMPLE.md
├── nifi-config/               # Connection configurations
│   ├── rabbitmq-connection.json
│   ├── database-connection.json
│   └── service-endpoints.json
└── nifi-extensions/           # Custom extensions
    └── drivers/              # JDBC drivers
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| NiFi not starting | Check logs: `docker logs nifi` |
| Connection refused | Verify service names, not localhost |
| Database error | Download JDBC driver |
| Out of memory | Increase heap in docker-compose.yml |
| Processor stuck | Check back pressure settings |
| Message not consumed | Verify RabbitMQ queue exists |

## Performance Tips

1. **Batch Processing**: Set appropriate batch sizes
2. **Concurrent Tasks**: Adjust based on load
3. **Back Pressure**: Configure thresholds properly
4. **Connection Pooling**: Tune pool sizes
5. **Run Schedule**: Use appropriate intervals
6. **Buffer Sizes**: Adjust for throughput

## Security Best Practices

1. Change default admin password
2. Enable HTTPS in production
3. Use SSL for RabbitMQ connections
4. Encrypt sensitive data in flows
5. Use Parameter Contexts for credentials
6. Enable audit logging
7. Restrict network access

## Next Steps

1. ✅ Start NiFi: `.\start-nifi.ps1`
2. ✅ Download JDBC driver: `.\download-jdbc-driver.ps1`
3. ✅ Access UI: http://localhost:8080/nifi
4. ✅ Create first flow (RabbitMQ consumer)
5. ✅ Test with sample data
6. ✅ Monitor and optimize

## Resources

- **Setup Guide**: `NIFI_SETUP.md`
- **Templates Guide**: `nifi-templates/README.md`
- **Example Flow**: `nifi-templates/ORDER_PROCESSING_EXAMPLE.md`
- **Official Docs**: https://nifi.apache.org/docs.html

---

**Quick Start**: `.\start-nifi.ps1` → http://localhost:8080/nifi → Login (admin/AdminPass123456)
