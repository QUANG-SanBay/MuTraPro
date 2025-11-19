package com.mutrapro.media_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mutrapro.media_service.model.MediaFile;
import com.mutrapro.media_service.service.MediaFileService;

@RestController
@RequestMapping("/media")
public class MediaFileController {

    private final MediaFileService service;

    public MediaFileController(MediaFileService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public MediaFile upload(@RequestBody MediaFile file) {
        return service.save(file);
    }

    @GetMapping
    public List<MediaFile> getAll() {
        return service.getAll();
    }

    @GetMapping("/public")
    public List<MediaFile> getPublicFiles() {
        return service.getAllPublic();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaFile> get(@PathVariable String id) {
        MediaFile file = service.getById(id);
        if (file == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(file);
    }
}
