package com.mutrapro.media_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mutrapro.media_service.model.AccessLevel;
import com.mutrapro.media_service.model.MediaFile;
import com.mutrapro.media_service.repository.MediaFileRepository;

@Service
public class MediaFileService {

    private final MediaFileRepository repository;

    public MediaFileService(MediaFileRepository repository) {
        this.repository = repository;
    }

    public MediaFile save(MediaFile file) {
        file.ensureId();
        file.setUploadTimestamp(LocalDateTime.now());
        return repository.save(file);
    }

    public List<MediaFile> getAll() {
        return repository.findAll();
    }

    public List<MediaFile> getAllPublic() {
        return repository.findByAccessLevel(AccessLevel.PUBLIC);
    }

    public MediaFile getById(String id) {
        return repository.findById(id).orElse(null);
    }
}
