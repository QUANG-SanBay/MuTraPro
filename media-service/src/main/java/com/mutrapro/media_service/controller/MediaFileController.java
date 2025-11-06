package com.mutrapro.media_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mutrapro.media_service.model.MediaFile;
import com.mutrapro.media_service.service.MediaFileService;

@RestController
@RequestMapping("/api/media")
public class MediaFileController {

    private final MediaFileService mediaFileService;

    public MediaFileController(MediaFileService mediaFileService) {
        this.mediaFileService = mediaFileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<MediaFile> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerUserId") Long ownerUserId,
            @RequestParam("entityId") Long entityId,
            @RequestParam("entityType") String entityType) throws IOException {

        String fakeStorageUrl = "https://storage.mutrapro.com/uploads/" + file.getOriginalFilename();
        MediaFile saved = mediaFileService.uploadFile(file, ownerUserId, entityId, entityType, fakeStorageUrl);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<MediaFile> getFileById(@PathVariable UUID fileId) {
        Optional<MediaFile> file = mediaFileService.getFileById(fileId);
        return file.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerUserId}")
    public List<MediaFile> getFilesByOwner(@PathVariable Long ownerUserId) {
        return mediaFileService.getFilesByOwner(ownerUserId);
    }

    @GetMapping("/entity")
    public List<MediaFile> getFilesByEntity(@RequestParam Long entityId, @RequestParam String entityType) {
        return mediaFileService.getFilesByEntity(entityId, entityType);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable UUID fileId) {
        mediaFileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }
}
