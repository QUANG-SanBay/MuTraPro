package com.mutrapro.order_service.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mutrapro.order_service.model.Order;
import com.mutrapro.order_service.model.OrderStatus;
import com.mutrapro.order_service.service.FileStorageService;
import com.mutrapro.order_service.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private FileStorageService fileStorageService;

    // Endpoint upload file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadOrder(
            @RequestParam("customerName") String customerName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("tags") String tags,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Order order = new Order();
            order.setOrderDate(new Date());
            order.setLanCuoiCapNhat(new Date());
            order.setTrangThai(OrderStatus.PENDING);
            order.setOrderType("upload");
            order.setCustomerName(customerName);
            order.setEmail(email);
            order.setPhone(phone);
            order.setTags(tags);
            order.setRequestCode("REQ-" + System.currentTimeMillis());
            order.setTotalAmount(100.0);

            if (file != null && !file.isEmpty()) {
                String savedPath = fileStorageService.storeFile(file);
                order.setFilePath(savedPath);
            }

            Order saved = orderService.createOrder(order);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("❌ Lỗi Upload Order: " + e.getMessage());
        }
    }

    // Endpoint đặt lịch thu âm
    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleRecording(@RequestBody Map<String, String> payload) {
        try {
            String serviceType = payload.get("serviceType");
            String date = payload.get("date");
            String time = payload.get("time");
            String songName = payload.get("songName");
            String description = payload.get("description");

            Order order = new Order();
            order.setOrderDate(new Date()); // Bạn có thể parse date + time nếu cần
            order.setLanCuoiCapNhat(new Date());
            order.setTrangThai(OrderStatus.PENDING);
            order.setOrderType(serviceType);
            order.setCustomerName(songName); // tạm lưu tên bài hát
            order.setTags(description);      // tạm lưu mô tả
            order.setRequestCode("REQ-" + System.currentTimeMillis());
            order.setTotalAmount(100.0);

            Order saved = orderService.createOrder(order);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("❌ Lỗi tạo lịch thu âm: " + e.getMessage());
        }
    }
}
