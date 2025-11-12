package com.mutrapro.order_service.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mutrapro.order_service.model.Order;
import com.mutrapro.order_service.model.OrderStatus;
import com.mutrapro.order_service.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // ===== Lấy tất cả orders =====
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ===== Tạo order mới =====
    public Order createOrder(Order order) {
        if (order.getTrangThai() == null) order.setTrangThai(OrderStatus.NEW);
        if (order.getThoiGianTao() == null) order.setThoiGianTao(new Date());
        if (order.getLanCuoiCapNhat() == null) order.setLanCuoiCapNhat(new Date());
        if (order.getTongTien() <= 0) order.tinhTongTien();
        if (order.getCustomerId() == null) order.setCustomerId(0);

        // cascade save ServiceRequestFile
        if (order.getServiceRequestFile() != null) {
            order.getServiceRequestFile().setOrder(order);
        }

        return orderRepository.save(order);
    }

    // ===== Cập nhật trạng thái order =====
    public Optional<Order> updateOrderStatus(Integer id, OrderStatus status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.capNhatTrangThai(status);
                    return orderRepository.save(order);
                });
    }

    // ===== Lấy order theo id =====
    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }
}
