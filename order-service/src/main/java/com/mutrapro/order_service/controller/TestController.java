package com.mutrapro.order_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "✅ Order Service is running!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "🚀 Connected to Order Service successfully!";
    }
}
