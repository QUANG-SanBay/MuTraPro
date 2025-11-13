package com.mutrapro.notificationservice.messaging;

import com.mutrapro.notificationservice.dto.NotificationPayload;
import com.mutrapro.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import static com.mutrapro.notificationservice.config.RabbitMQConfig.QUEUE_NAME;

@Component
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate; // send to websocket

    @RabbitListener(queues = QUEUE_NAME)
    public void receive(NotificationPayload payload) {
        System.out.println(" Received from RabbitMQ: " + payload);
        notificationService.createNotification(payload);

        // Gửi realtime tới FE nếu dùng WebSocket
        messagingTemplate.convertAndSend("/topic/notifications/" + payload.getUserId(), payload);
    }
}
