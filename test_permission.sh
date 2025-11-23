#!/bin/bash

echo "=========================================="
echo "TEST PHÂN QUYỀN - XEM HỒ SƠ"
echo "=========================================="

# 1. Đăng nhập với customer có quyền view_own_profile (mặc định)
echo -e "\n1. Test với Customer CÓ quyền 'view_own_profile':"
echo "   Đăng nhập..."

# Bạn cần thay thế username và password thật
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:8000/api/user-service/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer_test",
    "password": "password123"
  }' | jq -r '.access')

echo "   Token: ${CUSTOMER_TOKEN:0:20}..."

echo "   Gọi GET /users/me..."
curl -X GET http://localhost:8000/api/user-service/users/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json"

echo -e "\n   ✅ Kết quả mong đợi: 200 OK - Trả về thông tin user"

# 2. Xóa quyền view_own_profile khỏi customer
echo -e "\n\n2. Xóa quyền 'view_own_profile' khỏi Customer:"
echo "   Vào UI Admin → Permissions → Chọn Customer → Xóa 'view_own_profile' → Lưu"
echo "   Hoặc dùng API:"
echo "   PUT /api/user-service/users/roles/customer/permissions/update"
echo "   Body: {\"permissions\": [\"edit_own_profile\", \"create_order\", ...]}"
read -p "   Nhấn Enter sau khi đã xóa quyền..."

# 3. Test lại sau khi xóa quyền
echo -e "\n3. Test lại với Customer KHÔNG có quyền 'view_own_profile':"
echo "   Gọi GET /users/me..."
curl -X GET http://localhost:8000/api/user-service/users/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json"

echo -e "\n   ❌ Kết quả mong đợi: 403 FORBIDDEN - Permission denied"

# 4. Thêm lại quyền
echo -e "\n\n4. Thêm lại quyền 'view_own_profile' cho Customer:"
read -p "   Nhấn Enter sau khi đã thêm lại quyền..."

echo "   Test lại..."
curl -X GET http://localhost:8000/api/user-service/users/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json"

echo -e "\n   ✅ Kết quả mong đợi: 200 OK - Lại trả về thông tin user"

echo -e "\n=========================================="
echo "HOÀN TẤT TEST!"
echo "=========================================="
