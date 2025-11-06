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

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
        order.setThoiGianTao(new Date());
        order.setLanCuoiCapNhat(new Date());
        order.setTrangThai(OrderStatus.PENDING);

        if (order.getTongTien() <= 0) {
            order.tinhTongTien();
        }

        return orderRepository.save(order);
    }

    public Optional<Order> updateOrderStatus(Integer id, OrderStatus status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.capNhatTrangThai(status);
                    return orderRepository.save(order);
                });
    }

    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }
}
