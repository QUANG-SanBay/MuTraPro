# Hướng dẫn Test Hệ thống Phân quyền

## 1. Test Backend APIs

### Bước 1: Đăng nhập và lấy token
```bash
# Đăng nhập với tài khoản admin
curl -X POST http://localhost:8000/api/user-service/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'

# Lưu access_token từ response
```

### Bước 2: Test các API endpoints

#### 2.1. Lấy tất cả permissions
```bash
curl -X GET http://localhost:8000/api/user-service/users/permissions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: Danh sách 42 permissions
```

#### 2.2. Lấy danh sách roles
```bash
curl -X GET http://localhost:8000/api/user-service/users/roles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: Array của 6 roles (không có admin)
```

#### 2.3. Lấy permissions của một role
```bash
curl -X GET http://localhost:8000/api/user-service/users/roles/customer/permissions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: {"role": "customer", "permissions": [...16 permissions...]}
```

#### 2.4. Cập nhật permissions cho role
```bash
curl -X PUT http://localhost:8000/api/user-service/users/roles/customer/permissions/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["view_own_profile", "edit_own_profile", "create_order"]
  }'

# Expected: {"message": "Cập nhật quyền thành công", "added": X, "removed": Y}
```

#### 2.5. Reset về mặc định
```bash
curl -X POST http://localhost:8000/api/user-service/users/roles/customer/reset-default \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: {"message": "Đã khôi phục quyền mặc định", "permissions": [...]}
```

#### 2.6. Kiểm tra permission của user
```bash
curl -X GET "http://localhost:8000/api/user-service/users/permissions/check?permission=view_all_users" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: {"has_permission": true/false, "permission": "view_all_users", "user_role": "admin"}
```

---

## 2. Test Frontend UI

### Bước 1: Truy cập trang quản lý phân quyền
1. Đăng nhập với tài khoản **admin**
2. Truy cập: `http://localhost:3000/admin/permissions`

### Bước 2: Test chức năng UI

#### Test 1: Chọn role và xem permissions
- ✅ Click vào một role card (ví dụ: "Khách hàng")
- ✅ Kiểm tra danh sách "Quyền đã gán" hiển thị đúng
- ✅ Mở Developer Console (F12) → Xem log:
  ```
  [RolePermissionManagement] Loaded X permissions for role: customer
  ```

#### Test 2: Thêm/xóa permissions
- ✅ Chọn một permission trong "Quyền có sẵn"
- ✅ Click nút → (mũi tên phải) để thêm vào "Quyền đã gán"
- ✅ Chọn một permission trong "Quyền đã gán"
- ✅ Click nút ← (mũi tên trái) để xóa

#### Test 3: Lưu thay đổi
- ✅ Click nút "Lưu cấu hình quyền"
- ✅ Xem alert thành công: "Cập nhật quyền cho vai trò ... thành công! (+X -Y)"
- ✅ Reload trang và chọn lại role → Xem permissions đã được lưu

#### Test 4: Reset về mặc định
- ✅ Thay đổi permissions của một role
- ✅ Click nút "Khôi phục mặc định"
- ✅ Xem alert: "Đã khôi phục X quyền mặc định..."
- ✅ Kiểm tra permissions đã về đúng mặc định

#### Test 5: Tìm kiếm permissions
- ✅ Nhập từ khóa vào ô tìm kiếm (ví dụ: "đơn hàng")
- ✅ Danh sách permissions được filter đúng

---

## 3. Test Permission Decorator trong Views

### Bước 1: Tạo test endpoint có bảo vệ permission

Thêm vào `user-service/userService/account/views.py`:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import HasPermission, require_permission

@api_view(['GET'])
@permission_classes([IsAuthenticated, HasPermission])
@require_permission('view_all_users')
def test_protected_endpoint(request):
    return Response({
        'message': 'Bạn có quyền view_all_users!',
        'user': request.user.username,
        'role': request.user.role
    })
```

Thêm vào `urls.py`:
```python
path('test-permission', test_protected_endpoint, name='test_permission'),
```

### Bước 2: Test với các role khác nhau

#### Test với role có permission (service_coordinator):
```bash
# Đăng nhập với service_coordinator
curl -X POST http://localhost:8000/api/user-service/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "coordinator_user", "password": "password"}'

# Gọi endpoint protected
curl -X GET http://localhost:8000/api/user-service/users/test-permission \
  -H "Authorization: Bearer COORDINATOR_TOKEN"

# Expected: {"message": "Bạn có quyền view_all_users!", ...}
```

#### Test với role KHÔNG có permission (customer):
```bash
# Đăng nhập với customer
curl -X POST http://localhost:8000/api/user-service/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "customer_user", "password": "password"}'

# Gọi endpoint protected
curl -X GET http://localhost:8000/api/user-service/users/test-permission \
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# Expected: 403 Forbidden (không có quyền)
```

---

## 4. Kiểm tra Database

### Xem permissions trong DB:
```bash
docker exec -it user-service python manage.py shell

>>> from account.models import Permission, RolePermission
>>> Permission.objects.count()
42  # Phải có 42 permissions

>>> RolePermission.objects.filter(role='customer').count()
16  # Customer có 16 permissions mặc định

>>> # Xem chi tiết permissions của customer
>>> perms = RolePermission.objects.filter(role='customer').values_list('permission__codename', flat=True)
>>> list(perms)
['view_own_profile', 'edit_own_profile', ...]
```

---

## 5. Test Scenarios Quan trọng

### Scenario 1: Admin luôn có tất cả quyền
```python
# Admin KHÔNG cần kiểm tra RolePermission
# HasPermission class tự động return True cho admin
```

### Scenario 2: Xóa permission khỏi role
1. Xóa permission "create_order" khỏi role "customer"
2. Đăng nhập với customer account
3. Gọi endpoint yêu cầu "create_order" → Phải trả về 403

### Scenario 3: Thêm permission vào role
1. Thêm permission "view_all_users" cho role "customer"
2. Đăng nhập với customer account
3. Gọi endpoint yêu cầu "view_all_users" → Phải trả về 200

### Scenario 4: Reset về mặc định
1. Thay đổi permissions của "customer"
2. Reset về mặc định
3. Kiểm tra DB → Phải có đúng 16 permissions như ban đầu

---

## 6. Debug Tips

### Nếu permissions không hoạt động:

#### Check 1: Migrations đã chạy chưa?
```bash
docker exec user-service python manage.py showmigrations account
# Phải thấy [X] 0002_permission_rolepermission
```

#### Check 2: Seed permissions đã chạy chưa?
```bash
docker exec user-service python manage.py shell
>>> from account.models import Permission
>>> Permission.objects.count()
42  # Phải có 42
```

#### Check 3: User có đúng role không?
```bash
docker exec user-service python manage.py shell
>>> from account.models import User
>>> user = User.objects.get(username='test_user')
>>> user.role
'customer'
```

#### Check 4: Check decorator có được áp dụng không?
```python
# Trong view, thêm log:
@require_permission('view_all_users')
def my_view(request):
    print(f"Required permission: {my_view.required_permission}")  # Phải in ra 'view_all_users'
    ...
```

#### Check 5: Frontend có gọi đúng API không?
- Mở Developer Console (F12)
- Tab Network → Xem request/response
- Kiểm tra Authorization header có token không
- Xem response status và body

---

## 7. Expected Results Summary

| Test | Expected Result |
|------|----------------|
| Seed permissions | ✅ 42 permissions, 104 role-permission mappings |
| GET /permissions | ✅ 200 OK, array of 42 permissions |
| GET /roles | ✅ 200 OK, 6 roles (không có admin) |
| GET /roles/{role}/permissions | ✅ 200 OK, danh sách permissions của role |
| PUT /roles/{role}/permissions/update | ✅ 200 OK, message + added/removed count |
| POST /roles/{role}/reset-default | ✅ 200 OK, permissions reset về default |
| Frontend UI load | ✅ Hiển thị 6 role cards |
| Chọn role | ✅ Load permissions từ backend, split thành 2 lists |
| Thêm/xóa permissions | ✅ UI update real-time |
| Lưu changes | ✅ Success alert, data persist sau reload |
| Reset to default | ✅ Success alert, permissions về mặc định |
| Protected endpoint + có quyền | ✅ 200 OK, data returned |
| Protected endpoint + KHÔNG quyền | ✅ 403 Forbidden |
| Admin role | ✅ Luôn có tất cả quyền (bypass check) |

---

## 8. Quick Test Script

```bash
#!/bin/bash

echo "=== Testing Permission System ==="

# 1. Check migrations
echo "1. Checking migrations..."
docker exec user-service python manage.py showmigrations account | grep "0002_permission"

# 2. Check permissions count
echo "2. Checking permissions count..."
docker exec user-service python manage.py shell -c "from account.models import Permission; print(f'Permissions: {Permission.objects.count()}')"

# 3. Check role-permission mappings
echo "3. Checking role-permission mappings..."
docker exec user-service python manage.py shell -c "from account.models import RolePermission; print(f'Mappings: {RolePermission.objects.count()}')"

# 4. Test API (cần thay YOUR_TOKEN)
echo "4. Testing API..."
curl -s -X GET http://localhost:8000/api/user-service/users/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.permissions | length'

echo "=== Test Complete ==="
```

---

## Kết luận

Hệ thống phân quyền hoạt động đúng khi:
1. ✅ Database có đầy đủ permissions và role-permission mappings
2. ✅ APIs trả về đúng data
3. ✅ Frontend UI load và lưu được permissions
4. ✅ Protected endpoints từ chối access khi không có quyền
5. ✅ Protected endpoints cho phép access khi có quyền
6. ✅ Admin luôn có full access

Chúc bạn test thành công! 🎉
