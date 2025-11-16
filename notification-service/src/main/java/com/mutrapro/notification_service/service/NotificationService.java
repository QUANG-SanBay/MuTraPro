package com.mutrapro.notificationservice.service;

import com.mutrapro.notificationservice.dto.NotificationPayload;
import com.mutrapro.notificationservice.entity.Notification;
import com.mutrapro.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.mutrapro.notificationservice.config.RabbitMQConfig.EXCHANGE_NAME;
import static com.mutrapro.notificationservice.config.RabbitMQConfig.ROUTING_KEY;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final RabbitTemplate rabbitTemplate;

    public Notification createNotification(NotificationPayload payload) {
        Notification n = Notification.builder()
                .userId(payload.getUserId())
                .type(payload.getType())
                .message(payload.getMessage())
                .build();
        return repository.save(n);
    }

    public List<Notification> getNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void publish(NotificationPayload payload) {
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payload);
    }
}
