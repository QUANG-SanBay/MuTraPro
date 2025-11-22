# WebSocket Live Events Testing Guide

## Tổng quan
Hệ thống LiveActivityFeed đã được cấu hình để hoạt động thời gian thực với RabbitMQ và WebSocket.

## Kiến trúc
```
User Service (Django) 
    → Publish events → RabbitMQ (user.events exchange)
    → Gateway (Node.js) subscribes → RabbitMQ
    → Gateway broadcasts → WebSocket clients
    → Frontend (React) receives → LiveActivityFeed component
    → Updates UI & highlights user in table
```

## Cài đặt và chạy

### 1. Cài đặt dependencies cho Gateway
```bash
cd gate-way
npm install
```

Đã thêm 2 packages:
- `amqplib@^0.10.5` - RabbitMQ client cho Node.js
- `ws@^8.18.0` - WebSocket server

### 2. Rebuild và khởi động services
```bash
# Từ thư mục root của project
docker-compose build --no-cache gateway user-service
docker-compose up -d rabbitmq gateway user-service
```

### 3. Kiểm tra services đang chạy
```bash
docker-compose ps
```

Các services cần thiết:
- `rabbitmq` - Port 5672 (AMQP), 15672 (Management UI)
- `gateway` - Port 8000 (HTTP + WebSocket)
- `user-service` - Port 8000 (nội bộ trong Docker network)

### 4. Kiểm tra kết nối RabbitMQ
Mở RabbitMQ Management UI: http://localhost:15672
- Username: `guest`
- Password: `guest`

Kiểm tra:
- Exchange `user.events` đã được tạo
- Có queue tạm thời được bind vào `user.events` (exclusive queue từ Gateway)

### 5. Kiểm tra WebSocket endpoint
```bash
# PowerShell - kiểm tra status endpoint
curl http://localhost:8000/ws/status
```

Response mẫu:
```json
{
  "rabbitmqConnected": true,
  "connectedClients": 0,
  "websocketClients": 0,
  "timestamp": "2025-11-19T10:30:00.000Z"
}
```

### 6. Khởi động Frontend
```bash
cd frontend
npm start
```

Frontend sẽ tự động kết nối WebSocket đến: `ws://localhost:8000/ws/events`

## Testing Flow

### Test 1: Đăng ký user mới
1. Mở frontend: http://localhost:3000
2. Đăng nhập với admin account
3. Vào trang User Management: http://localhost:3000/admin/users
4. Click "Thêm người dùng" và tạo user mới
5. **Kết quả mong đợi**:
   - LiveActivityFeed hiển thị event mới với icon 👤
   - User mới xuất hiện trong bảng với **flash green animation**
   - Event label: "Đăng ký"
   - Thời gian: "Vừa xong"

### Test 2: Đăng nhập user
1. Đăng xuất khỏi admin account
2. Đăng nhập với user vừa tạo
3. Admin account (ở tab khác) quan sát User Management page
4. **Kết quả mong đợi**:
   - LiveActivityFeed hiển thị login event với icon 🔐
   - Row của user đó flash **blue animation**
   - Event label: "Đăng nhập"

### Test 3: Multiple users cùng lúc
1. Mở nhiều browser/incognito tabs
2. Đăng ký/đăng nhập nhiều users
3. **Kết quả mong đợi**:
   - Tất cả events xuất hiện theo thứ tự thời gian (mới nhất trên cùng)
   - Chỉ giữ lại 10 events gần nhất
   - Mỗi event trigger highlight animation tương ứng

## Console Logs để debug

### Frontend console (Chrome DevTools)
```
[LiveActivityFeed] Connecting to WebSocket: ws://localhost:8000/ws/events
[LiveActivityFeed] WebSocket connected
[LiveActivityFeed] Connection status: true
[LiveActivityFeed] Received: event
[LiveActivityFeed] New event: user.registered
```

### Gateway logs (Docker)
```bash
docker logs -f gateway
```
Expected output:
```
Gateway chạy tại http://localhost:8000
WebSocket endpoint: ws://localhost:8000/ws/events
[RabbitMQ-WS] Connecting to RabbitMQ...
[RabbitMQ-WS] Connected successfully. Listening for user events...
[WebSocket] New client connected from ::ffff:172.18.0.1
[RabbitMQ-WS] Client connected. Total clients: 1
[RabbitMQ-WS] Received event: user.registered
[RabbitMQ-WS] Broadcasted event to 1 client(s)
```

### User Service logs (Django)
```bash
docker logs -f user-service
```
Expected output:
```
[RabbitMQ] Successfully published event: user.registered
[RabbitMQ] Event data: {'user_id': 123, 'email': 'test@example.com', ...}
```

## Troubleshooting

### Issue: WebSocket không kết nối được
**Triệu chứng**: Frontend console hiển thị "WebSocket error" hoặc "Mất kết nối"

**Giải pháp**:
1. Kiểm tra Gateway đang chạy: `docker ps | grep gateway`
2. Kiểm tra logs: `docker logs gateway`
3. Kiểm tra port 8000 không bị conflict: `netstat -an | findstr :8000`
4. Restart gateway: `docker-compose restart gateway`

### Issue: RabbitMQ không connected
**Triệu chứng**: Gateway logs hiển thị "Failed to connect to RabbitMQ"

**Giải pháp**:
1. Kiểm tra RabbitMQ đang chạy: `docker ps | grep rabbitmq`
2. Kiểm tra RabbitMQ logs: `docker logs rabbitmq`
3. Restart RabbitMQ: `docker-compose restart rabbitmq`
4. Đợi 5-10 giây để Gateway tự reconnect

### Issue: Events không xuất hiện trong UI
**Triệu chứng**: Đăng ký/login thành công nhưng LiveActivityFeed không cập nhật

**Debug checklist**:
1. Mở Frontend console → có logs "[LiveActivityFeed] Received: event" không?
2. Mở Gateway logs → có "Broadcasted event" không?
3. Mở RabbitMQ Management UI → vào tab "user.events" exchange → có messages đi qua không?
4. Test consumer script: `python test_event_consumer.py` (từ thư mục root)

### Issue: Highlight animation không hoạt động
**Triệu chứng**: Event xuất hiện nhưng table row không flash

**Giải pháp**:
1. Kiểm tra `user_id` trong event data match với user trong table
2. Mở React DevTools → kiểm tra `highlightedUserId` state của UserManagement
3. Refresh trang User Management để đảm bảo có data mới nhất
4. Kiểm tra CSS đã load: `UserManagement.module.scss` có `@keyframes flashGreen` và `flashBlue`

## Testing với Python Consumer Script

Nếu muốn test chỉ RabbitMQ mà không cần frontend:

```bash
# Terminal 1: Run consumer
python test_event_consumer.py

# Terminal 2: Trigger events qua API
curl -X POST http://localhost:8000/user-service/account/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "full_name": "Test User",
    "phone_number": "0123456789",
    "role": "customer"
  }'
```

Consumer script sẽ in ra event real-time với màu sắc:
- 🟢 GREEN: user.registered
- 🔵 BLUE: user.login

## Environment Variables

### Frontend (.env)
```env
REACT_APP_WS_URL=ws://localhost:8000/ws/events
```

### Gateway (docker-compose.yml - đã cấu hình)
```yaml
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
```

## Monitoring

### 1. RabbitMQ Management UI
http://localhost:15672 → Exchanges → user.events
- Xem message rate
- Xem bindings
- Monitor queues

### 2. Gateway Status Endpoint
```bash
curl http://localhost:8000/ws/status
```

### 3. Frontend Connection Status
Trong LiveActivityFeed component, góc trên bên phải:
- 🟢 "Đang kết nối" - WebSocket active
- ⚪ "Mất kết nối" - WebSocket disconnected

## Performance Notes

- **Message retention**: LiveActivityFeed chỉ giữ 10 events gần nhất trong memory
- **Auto-reconnect**: WebSocket tự động reconnect sau 5 giây nếu mất kết nối
- **Highlight duration**: Animation highlight table row tự động tắt sau 5 giây
- **RabbitMQ queue**: Exclusive queue tự động xóa khi Gateway disconnect

## Next Steps (Optional Enhancements)

1. **Persistent event history**: Lưu events vào database để xem lại lịch sử
2. **Event filtering**: Cho phép user filter events theo type (register/login)
3. **Sound notifications**: Thêm âm thanh khi có event mới
4. **Desktop notifications**: Browser notifications cho events quan trọng
5. **Event statistics**: Dashboard hiển thị biểu đồ events theo thời gian

## Support

Nếu gặp vấn đề:
1. Check logs ở cả 3 layers: Frontend console, Gateway logs, User-service logs
2. Verify RabbitMQ exchange và bindings trong Management UI
3. Test với `test_event_consumer.py` để isolate vấn đề
4. Restart toàn bộ stack: `docker-compose down && docker-compose up -d`
