# NiFi Flow Example: Order Processing with Payment and Notification

## Flow Description
This example demonstrates a complete order processing workflow that:
1. Consumes order creation events from RabbitMQ
2. Validates order data
3. Calls Payment Service API to process payment
4. Updates order status in database
5. Sends notification via Notification Service
6. Publishes completion event back to RabbitMQ

## Flow Diagram

```
┌─────────────────────┐
│   ConsumeAMQP       │  Consume from order-queue
│   (Order Queue)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  EvaluateJsonPath   │  Extract: orderId, userId, amount
│  (Parse Order)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  RouteOnAttribute   │  Check: amount > 0 && orderId exists
│  (Validate Order)   │
└──────────┬──────────┘
           │
    ┌──────┴───────┐
    │              │
    │ Valid        │ Invalid
    ▼              ▼
┌────────────┐  ┌────────────┐
│ InvokeHTTP │  │ LogAttribute│
│ (Payment)  │  │ (Error Log) │
└─────┬──────┘  └─────┬──────┘
      │               │
      ▼               ▼
┌────────────┐  ┌────────────┐
│RouteOnAttr │  │ PublishAMQP│
│(Check Pay) │  │(Error Queue)│
└─────┬──────┘  └────────────┘
      │
  ┌───┴────┐
  │        │
Success   Fail
  │        │
  ▼        ▼
┌──────┐ ┌──────┐
│ DB   │ │Retry │
│Update│ │Logic │
└──┬───┘ └───┬──┘
   │         │
   ▼         ▼
┌──────────────┐
│ InvokeHTTP   │
│(Notification)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PublishAMQP  │
│(Success Queue)│
└──────────────┘
```

## Processor Configurations

### 1. ConsumeAMQP - Consume Order Events
```json
{
  "processorType": "ConsumeAMQP",
  "name": "Consume Order Queue",
  "properties": {
    "Host Name": "rabbitmq",
    "Port": "5672",
    "Virtual Host": "/",
    "User Name": "guest",
    "Password": "guest",
    "Queue": "order-queue",
    "Prefetch Count": "10",
    "Batch Size": "10",
    "Auto Acknowledge": "false"
  },
  "autoTerminatedRelationships": [],
  "scheduling": {
    "schedulingStrategy": "TIMER_DRIVEN",
    "schedulingPeriod": "0 sec",
    "concurrentTasks": 2
  }
}
```

### 2. EvaluateJsonPath - Extract Order Data
```json
{
  "processorType": "EvaluateJsonPath",
  "name": "Parse Order JSON",
  "properties": {
    "Destination": "flowfile-attribute",
    "Return Type": "auto-detect",
    "orderId": "$.orderId",
    "userId": "$.userId",
    "amount": "$.amount",
    "items": "$.items",
    "timestamp": "$.timestamp"
  }
}
```

### 3. RouteOnAttribute - Validate Order
```json
{
  "processorType": "RouteOnAttribute",
  "name": "Validate Order Data",
  "properties": {
    "Routing Strategy": "Route to Property name",
    "valid": "${orderId:isEmpty():not():and(${amount:toNumber():gt(0)})}"
  },
  "autoTerminatedRelationships": ["unmatched"]
}
```

### 4. InvokeHTTP - Call Payment Service
```json
{
  "processorType": "InvokeHTTP",
  "name": "Process Payment",
  "properties": {
    "HTTP Method": "POST",
    "Remote URL": "http://payment-service:4002/api/payments",
    "Content-Type": "application/json",
    "Request Body": "{\"orderId\":\"${orderId}\",\"amount\":${amount},\"userId\":\"${userId}\"}",
    "Connection Timeout": "5 sec",
    "Read Timeout": "30 sec",
    "Include Date Header": "true",
    "Follow Redirects": "true",
    "Attributes to Send": "",
    "Penalize on 'No Retry'": "false"
  },
  "autoTerminatedRelationships": ["Original", "Retry", "No Retry", "Failure"]
}
```

### 5. EvaluateJsonPath - Extract Payment Response
```json
{
  "processorType": "EvaluateJsonPath",
  "name": "Parse Payment Response",
  "properties": {
    "Destination": "flowfile-attribute",
    "paymentId": "$.paymentId",
    "paymentStatus": "$.status",
    "transactionId": "$.transactionId"
  }
}
```

### 6. RouteOnAttribute - Check Payment Status
```json
{
  "processorType": "RouteOnAttribute",
  "name": "Route Payment Result",
  "properties": {
    "Routing Strategy": "Route to Property name",
    "success": "${paymentStatus:equals('SUCCESS')}",
    "failed": "${paymentStatus:equals('FAILED')}"
  },
  "autoTerminatedRelationships": ["unmatched"]
}
```

### 7. ExecuteSQL - Update Order Status (Success Path)
```json
{
  "processorType": "PutDatabaseRecord",
  "name": "Update Order Status",
  "properties": {
    "Record Reader": "JsonTreeReader",
    "Statement Type": "UPDATE",
    "Database Connection Pooling Service": "DBCPConnectionPool-Order",
    "Catalog Name": "",
    "Schema Name": "dbo",
    "Table Name": "Orders",
    "Update Keys": "OrderId",
    "Field Containing SQL": "",
    "SQL Statement": "UPDATE Orders SET Status = 'PAID', PaymentId = ?, UpdatedAt = GETDATE() WHERE OrderId = ?"
  }
}
```

**DBCPConnectionPool-Order Configuration:**
```json
{
  "controllerServiceType": "DBCPConnectionPool",
  "name": "Order Database Connection",
  "properties": {
    "Database Connection URL": "jdbc:sqlserver://sqlserver:1433;databaseName=Mutrapro_Order;encrypt=false;trustServerCertificate=true",
    "Database Driver Class Name": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
    "Database Driver Location(s)": "/opt/nifi/nifi-current/extensions/drivers/mssql-jdbc-12.4.2.jre11.jar",
    "Database User": "sa",
    "Password": "Strong@Pass123",
    "Max Wait Time": "500 millis",
    "Max Total Connections": "8",
    "Validation query": "SELECT 1"
  }
}
```

### 8. InvokeHTTP - Send Notification
```json
{
  "processorType": "InvokeHTTP",
  "name": "Send Order Notification",
  "properties": {
    "HTTP Method": "POST",
    "Remote URL": "http://notification-service:4003/api/notifications",
    "Content-Type": "application/json",
    "Request Body": "{\"userId\":\"${userId}\",\"type\":\"ORDER_COMPLETED\",\"message\":\"Your order ${orderId} has been processed successfully\",\"data\":{\"orderId\":\"${orderId}\",\"paymentId\":\"${paymentId}\"}}",
    "Connection Timeout": "5 sec",
    "Read Timeout": "15 sec"
  },
  "autoTerminatedRelationships": ["Original", "Retry", "Failure"]
}
```

### 9. PublishAMQP - Publish Success Event
```json
{
  "processorType": "PublishAMQP",
  "name": "Publish Order Completed",
  "properties": {
    "Host Name": "rabbitmq",
    "Port": "5672",
    "Virtual Host": "/",
    "User Name": "guest",
    "Password": "guest",
    "Exchange Name": "mutrapro-exchange",
    "Routing Key": "order.completed",
    "Message Body": "{\"orderId\":\"${orderId}\",\"status\":\"COMPLETED\",\"paymentId\":\"${paymentId}\",\"timestamp\":\"${now():format('yyyy-MM-dd HH:mm:ss')}\"}"
  }
}
```

### 10. PublishAMQP - Publish Error Event (Failure Path)
```json
{
  "processorType": "PublishAMQP",
  "name": "Publish Order Failed",
  "properties": {
    "Host Name": "rabbitmq",
    "Port": "5672",
    "Exchange Name": "mutrapro-exchange",
    "Routing Key": "order.failed",
    "Message Body": "{\"orderId\":\"${orderId}\",\"status\":\"FAILED\",\"reason\":\"${paymentStatus}\",\"timestamp\":\"${now():format('yyyy-MM-dd HH:mm:ss')}\"}"
  }
}
```

### 11. RetryFlowFile - Retry Logic (Failure Path)
```json
{
  "processorType": "RetryFlowFile",
  "name": "Retry Failed Payment",
  "properties": {
    "Retry Attribute": "retry.count",
    "Maximum Retries": "3",
    "Penalize Retries": "true",
    "Reuse Mode": "Fail on Reuse",
    "Retry Delay": "30 sec"
  }
}
```

## Testing the Flow

### 1. Send Test Order Event
Use RabbitMQ Management UI or publish directly:

```json
{
  "orderId": "ORD-12345",
  "userId": "USER-001",
  "amount": 99.99,
  "items": [
    {
      "productId": "PROD-001",
      "quantity": 2,
      "price": 49.995
    }
  ],
  "timestamp": "2025-11-16T10:30:00Z"
}
```

### 2. Monitor Flow
- Check NiFi UI for processor statistics
- View data provenance for tracking
- Monitor bulletin board for errors

### 3. Verify Results
- Check Payment Service logs
- Query Order database for updated status
- Verify notification was sent
- Check completion event in RabbitMQ

## Error Handling

### Scenarios Covered:
1. **Invalid Order Data**: Logged and sent to error queue
2. **Payment Service Down**: Retried 3 times with backoff
3. **Database Connection Failed**: Flow stops, bulletin generated
4. **Notification Service Down**: Flow continues, logged as warning

## Performance Tuning

### For High Volume:
```json
{
  "ConsumeAMQP": {
    "concurrentTasks": 5,
    "batchSize": 50,
    "prefetchCount": 100
  },
  "InvokeHTTP": {
    "concurrentTasks": 10,
    "connectionPoolSize": 20
  },
  "PutDatabaseRecord": {
    "concurrentTasks": 3,
    "batchSize": 100
  }
}
```

### For Low Latency:
```json
{
  "schedulingPeriod": "0 sec",
  "yieldDuration": "1 sec",
  "penalizationPeriod": "30 sec"
}
```

## Monitoring Metrics

### Key Metrics to Watch:
- ConsumeAMQP: Messages consumed/sec
- InvokeHTTP (Payment): Response time, success rate
- PutDatabaseRecord: Records updated/sec
- PublishAMQP: Messages published/sec
- Overall: End-to-end latency

### Setting Up Alerts:
1. Enable bulletin reporting on all processors
2. Set alert threshold for:
   - Payment failures > 5%
   - Database errors > 0
   - Processing time > 10 seconds

## Extension Ideas

### Additional Features:
1. **Fraud Detection**: Add RouteOnAttribute to check amount thresholds
2. **Caching**: Use DistributedMapCache for user data
3. **Analytics**: Send metrics to time-series database
4. **Audit Trail**: Log all events to dedicated audit log
5. **Dead Letter Queue**: Handle permanently failed orders

### Integration Points:
- Add Media Service call for order confirmations
- Integrate with Management Studio for reporting
- Add User Service call for user preferences
- Connect to external payment gateways

## Troubleshooting

### Common Issues:

**Issue**: Payment Service not responding
```
Solution: 
- Check service health: curl http://payment-service:4002/health
- Verify network connectivity
- Review payment service logs
```

**Issue**: Database connection pool exhausted
```
Solution:
- Increase Max Total Connections in DBCPConnectionPool
- Reduce concurrent tasks
- Check for connection leaks
```

**Issue**: Messages not being consumed
```
Solution:
- Verify RabbitMQ queue exists
- Check credentials
- Ensure queue has messages: rabbitmqadmin list queues
```

## Best Practices Applied

1. **Idempotency**: Use unique transaction IDs
2. **Correlation**: Pass orderId through entire flow
3. **Error Recovery**: Implement retry with backoff
4. **Monitoring**: Track metrics at each step
5. **Logging**: Comprehensive error logging
6. **Validation**: Validate data early in flow
7. **Separation of Concerns**: Each processor single responsibility
8. **Graceful Degradation**: Continue flow even if notification fails

## Related Flows

- **Payment Refund Flow**: Reverse payment for cancelled orders
- **Order Status Sync**: Periodic sync of order statuses
- **Daily Order Report**: Aggregate daily order statistics
- **Inventory Update**: Update product inventory based on orders

This flow demonstrates best practices for building robust, production-ready data integration pipelines with Apache NiFi.
