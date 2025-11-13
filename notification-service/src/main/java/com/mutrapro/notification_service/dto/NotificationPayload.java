package com.mutrapro.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPayload {
    @NotBlank
    private String userId;

    @NotBlank
    private String type;

    @NotBlank
    private String message;
}
