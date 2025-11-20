package com.mutrapro.media_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testController {

    @GetMapping("/test-media")
    public String testMedia() {
        return "Media service is working!";
    }
}
