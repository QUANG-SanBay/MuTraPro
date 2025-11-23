package com.mutrapro.notificationservice.controller;

import com.mutrapro.notificationservice.dto.NotificationPayload;
import com.mutrapro.notificationservice.entity.Notification;
import com.mutrapro.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(service.getNotifications(userId));
    }

    @PostMapping("/publish")
    public ResponseEntity<String> publish(@RequestBody NotificationPayload payload) {
        service.publish(payload);
        return ResponseEntity.ok("✅ Notification published to queue");
    }

    @PostMapping("/_test/publish")
    public ResponseEntity<String> publishTest(@RequestBody NotificationPayload payload) {
        service.createNotification(payload);
        return ResponseEntity.ok("🧪 Notification saved (test mode)");
    }
}
