package com.mutrapro.order_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mutrapro.order_service.model.Order;
import com.mutrapro.order_service.model.OrderStatus;
import com.mutrapro.order_service.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ GET all orders
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // ✅ GET order by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            Optional<Order> order = orderService.getOrderById(id);
            return order.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // ✅ POST create order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order newOrder = orderService.createOrder(order);
            return ResponseEntity.ok(newOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // ✅ PUT update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer id, @RequestParam OrderStatus status) {
        try {
            Optional<Order> updatedOrder = orderService.updateOrderStatus(id, status);
            return updatedOrder.map(ResponseEntity::ok)
                               .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
