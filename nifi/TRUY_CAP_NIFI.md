# Hướng dẫn truy cập Apache NiFi

## ⚠️ Lưu ý quan trọng

NiFi version mới (2.6.0+) mặc định chạy trên **HTTPS** để bảo mật. 

## 🌐 Cách truy cập

### Truy cập qua HTTPS (Khuyến nghị)

1. Mở trình duyệt web
2. Truy cập: **https://localhost:8443/nifi**
3. Trình duyệt sẽ cảnh báo về chứng chỉ tự ký (self-signed certificate)
4. Chọn **"Advanced"** hoặc **"Nâng cao"**
5. Chọn **"Proceed to localhost (unsafe)"** hoặc **"Tiếp tục đến localhost (không an toàn)"**

### Thông tin đăng nhập

- **Username**: `admin`
- **Password**: `AdminPass123456`

## 🔧 Nếu vẫn không truy cập được

### 1. Kiểm tra NiFi đã khởi động
```powershell
docker logs nifi | Select-String "Started Server"
```

Bạn sẽ thấy: `Started Server on https://....:8443/nifi`

### 2. Kiểm tra port đang mở
```powershell
docker ps | Select-String "nifi"
```

Phải thấy: `0.0.0.0:8443->8443/tcp`

### 3. Kiểm tra kết nối
```powershell
Test-NetConnection -ComputerName localhost -Port 8443
```

Kết quả `TcpTestSucceeded : True` là thành công

### 4. Chờ NiFi khởi động hoàn toàn
NiFi cần 1-2 phút để khởi động. Kiểm tra logs:
```powershell
docker logs nifi --tail 50
```

Tìm dòng: `Started Application in ... seconds`

## 🔐 Vấn đề với Self-Signed Certificate

### Chrome/Edge
1. Vào https://localhost:8443/nifi
2. Click vào "Advanced" 
3. Click "Proceed to localhost (unsafe)"

### Firefox
1. Vào https://localhost:8443/nifi
2. Click "Advanced"
3. Click "Accept the Risk and Continue"

### Safari
1. Vào https://localhost:8443/nifi
2. Click "Show Details"
3. Click "visit this website"
4. Click "Visit Website" ở popup

## 📝 Ghi chú

- **HTTP trên port 8080** có thể không hoạt động do NiFi mặc định yêu cầu HTTPS
- Để sử dụng HTTP, cần cấu hình phức tạp hơn (không khuyến nghị cho development)
- Trong production, nên sử dụng chứng chỉ SSL hợp lệ

## 🚀 Quick Access

**Truy cập ngay**: https://localhost:8443/nifi

**Credentials**:
```
Username: admin
Password: AdminPass123456
```

## ❓ Troubleshooting

### "This site can't be reached"
- Chờ NiFi khởi động (1-2 phút)
- Kiểm tra Docker đang chạy: `docker ps`
- Restart NiFi: `docker-compose restart nifi`

### "ERR_SSL_PROTOCOL_ERROR"
- Đảm bảo dùng **https://** (không phải http://)
- Port phải là **8443** (không phải 8080)

### "Cannot connect to localhost:8443"
- Check port mapping: `docker port nifi`
- Restart container: `docker-compose restart nifi`

### Login không thành công
- Đảm bảo username: `admin` (không phải Admin)
- Password: `AdminPass123456` (đúng chữ hoa/thường)
- Clear browser cookies và thử lại

## 📚 Tài liệu thêm

- Setup chi tiết: `nifi/docs/NIFI_SETUP.md`
- Quick reference: `nifi/docs/NIFI_QUICK_REFERENCE.md`
- Examples: `nifi/templates/`
