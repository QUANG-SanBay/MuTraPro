package com.mutrapro.order_service.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mutrapro.order_service.model.Order;
import com.mutrapro.order_service.model.OrderStatus;
import com.mutrapro.order_service.model.ServiceRequestFile;
import com.mutrapro.order_service.model.ServiceType;
import com.mutrapro.order_service.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ===================== UPLOAD ORDER WITH FILE =====================
    @PostMapping("/upload")
    public ResponseEntity<?> createOrderWithFile(
            @RequestParam String serviceType,
            @RequestParam String note,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String customerIdStr
    ) {
        try {
            Order order = new Order();

            // ===== Parse customerId =====
            int customerId = 0;
            if (customerIdStr != null) {
                try { customerId = Integer.parseInt(customerIdStr); } 
                catch (NumberFormatException e) { customerId = 0; }
            }
            order.setCustomerId(customerId);

            // ===== Set ServiceType =====
            try {
                order.setServiceType(ServiceType.valueOf(serviceType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid serviceType. Must be TRANSLATION, PROOFREADING, REVIEW");
            }

            order.setNote(note);
            order.setThoiGianTao(new Date());
            order.setLanCuoiCapNhat(new Date());
            order.setTrangThai(OrderStatus.NEW);

            // ===== Handle file upload =====
            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                Path path = Paths.get("uploads/" + fileName);
                Files.createDirectories(path.getParent());
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                ServiceRequestFile requestFile = new ServiceRequestFile();
                requestFile.setFileName(fileName);
                requestFile.setFilePath(path.toString());

                order.setServiceRequestFile(requestFile); // auto set order trong setter
            }

            Order newOrder = orderService.createOrder(order);
            return ResponseEntity.ok(newOrder);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
