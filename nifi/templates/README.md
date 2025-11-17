# NiFi Flow Templates - Usage Guide

## Available Flow Templates for MuTraPro Project

### 1. RabbitMQ Message Router
**File:** `rabbitmq-message-router-template.xml`
**Purpose:** Route messages between different RabbitMQ queues based on message content and routing keys
**Use Cases:**
- Distribute payment events to multiple consumers
- Route order notifications to appropriate services
- Filter and transform messages before delivery

**Key Processors:**
- ConsumeAMQP: Consume messages from RabbitMQ queues
- RouteOnAttribute: Route based on message attributes
- PublishAMQP: Publish to different queues/exchanges

### 2. Database ETL Pipeline
**File:** `database-etl-pipeline-template.xml`
**Purpose:** Extract, Transform, Load data between SQL Server databases
**Use Cases:**
- Sync data across microservice databases
- Generate analytics and reports
- Data migration and backup

**Key Processors:**
- ExecuteSQL: Query source database
- ConvertRecord: Transform data formats
- PutDatabaseRecord: Insert/Update target database

### 3. REST API Data Integration
**File:** `rest-api-integration-template.xml`
**Purpose:** Integrate with microservices REST APIs
**Use Cases:**
- Aggregate data from multiple services
- Trigger service actions based on events
- Monitor service health and status

**Key Processors:**
- InvokeHTTP: Call REST endpoints
- EvaluateJsonPath: Extract JSON data
- UpdateAttribute: Add headers/parameters

### 4. Event-Driven Order Processing
**File:** `event-driven-order-processing-template.xml`
**Purpose:** Complete order processing workflow
**Use Cases:**
- Order creation → Payment → Notification flow
- Automatic order status updates
- Error handling and retry logic

**Workflow:**
1. Consume order creation event from RabbitMQ
2. Call Payment Service API
3. Update Order database
4. Send notification via Notification Service
5. Publish order completion event

### 5. Real-time Data Monitoring
**File:** `realtime-data-monitoring-template.xml`
**Purpose:** Monitor and alert on system events
**Use Cases:**
- Payment failure detection
- Service health monitoring
- Anomaly detection

**Key Processors:**
- MonitorActivity: Track data flow
- RouteOnContent: Detect patterns
- PutEmail/InvokeHTTP: Send alerts

### 6. File Processing Pipeline
**File:** `file-processing-pipeline-template.xml`
**Purpose:** Process uploaded media files
**Use Cases:**
- Image resizing and optimization
- Video transcoding
- File validation and virus scanning

**Key Processors:**
- ListFile/FetchFile: Monitor file uploads
- ExecuteScript: Custom processing logic
- PutFile/InvokeHTTP: Store processed files

## How to Import Templates into NiFi

### Step 1: Access NiFi UI
1. Start your Docker containers: `docker-compose up -d`
2. Wait for NiFi to start (may take 1-2 minutes)
3. Open browser to: http://localhost:8080/nifi
4. Login credentials:
   - Username: `admin`
   - Password: `AdminPass123456`

### Step 2: Import Template
1. Click the **Templates** icon (📋) in the top toolbar
2. Click **Browse** and select a template XML file
3. Click **Upload**

### Step 3: Add Template to Canvas
1. Drag the **Template** icon from toolbar to canvas
2. Select the template you just uploaded
3. Click **Add**

### Step 4: Configure Processors
1. Right-click on each processor (marked with ⚠️)
2. Select **Configure**
3. Update connection details:
   - RabbitMQ: host, port, credentials
   - Database: connection strings
   - HTTP: service URLs
4. Click **Apply**

### Step 5: Start the Flow
1. Right-click on the process group
2. Select **Start**
3. Monitor flow statistics in real-time

## Common NiFi Processor Configurations

### ConsumeAMQP (RabbitMQ Consumer)
```
Host Name: rabbitmq
Port: 5672
Virtual Host: /
User Name: guest
Password: guest
Queue: [your-queue-name]
```

### PublishAMQP (RabbitMQ Publisher)
```
Host Name: rabbitmq
Port: 5672
Exchange Name: mutrapro-exchange
Routing Key: [your.routing.key]
```

### DBCPConnectionPool (SQL Server)
```
Database Connection URL: jdbc:sqlserver://sqlserver:1433;databaseName=Mutrapro_[Service]
Database Driver Class Name: com.microsoft.sqlserver.jdbc.SQLServerDriver
Database Driver Location: /opt/nifi/nifi-current/extensions/drivers/mssql-jdbc.jar
Database User: sa
Password: Strong@Pass123
```

### InvokeHTTP (REST API Calls)
```
HTTP Method: GET/POST/PUT/DELETE
Remote URL: http://[service-name]:[port]/api/[endpoint]
Content-Type: application/json
```

## Best Practices

### 1. Error Handling
- Always configure failure relationships
- Use RetryFlowFile processor for transient errors
- Log errors to database or file for analysis

### 2. Performance Optimization
- Use appropriate batch sizes
- Configure concurrent tasks based on load
- Monitor back pressure thresholds

### 3. Data Provenance
- Enable data provenance for audit trails
- Track data lineage across services
- Use unique correlation IDs

### 4. Security
- Use HTTPS for external communications
- Encrypt sensitive data in flow files
- Implement proper access controls

### 5. Monitoring
- Set up bulletins for critical errors
- Monitor queue depths
- Track processor execution times

## Troubleshooting

### NiFi Not Starting
```bash
# Check container logs
docker logs nifi

# Check if port is available
netstat -ano | findstr :8080

# Restart container
docker-compose restart nifi
```

### Processor Configuration Errors
- Verify connection strings match docker-compose.yml
- Ensure services are running and accessible
- Check NiFi logs in container

### Connection Refused Errors
- Confirm all services are on same Docker network
- Use service names (not localhost) in URLs
- Verify ports are correctly exposed

### Database Connection Issues
- Download MS SQL JDBC driver manually if needed
- Place in `nifi-extensions/drivers/` folder
- Restart NiFi container

## Advanced Features

### Custom Processors
Place custom NAR files in `nifi-extensions/` directory

### Expression Language
Use NiFi Expression Language for dynamic values:
```
${hostname()}
${now():format('yyyy-MM-dd HH:mm:ss')}
${message:jsonPath('$.orderId')}
```

### Process Groups
Organize related processors into groups for better management

### Parameter Contexts
Store configuration as parameters for easy updates

## Integration Examples

### Example 1: Order Payment Flow
```
ConsumeAMQP (order-queue)
  → EvaluateJsonPath (extract order details)
  → InvokeHTTP (call payment service)
  → RouteOnAttribute (check payment status)
  → [Success] → UpdateAttribute → PublishAMQP (notification-queue)
  → [Failure] → LogAttribute → PublishAMQP (error-queue)
```

### Example 2: Database Sync
```
ExecuteSQL (query Payment DB)
  → ConvertRecord (JSON to SQL)
  → PutDatabaseRecord (insert to Analytics DB)
  → LogAttribute (log success)
```

### Example 3: Media Upload Processing
```
ListFile (monitor upload directory)
  → FetchFile
  → ValidateRecord (check file type)
  → InvokeHTTP (upload to media service)
  → DeleteFile (cleanup)
```

## Resources

- NiFi Documentation: https://nifi.apache.org/docs.html
- Expression Language Guide: https://nifi.apache.org/docs/nifi-docs/html/expression-language-guide.html
- Best Practices: https://nifi.apache.org/docs/nifi-docs/html/user-guide.html

## Support

For issues specific to this MuTraPro setup:
1. Check Docker logs: `docker logs nifi`
2. Verify network connectivity: `docker network inspect mutrapro_microservices-net`
3. Review NiFi bulletin board in UI
4. Check processor-specific logs in NiFi UI
