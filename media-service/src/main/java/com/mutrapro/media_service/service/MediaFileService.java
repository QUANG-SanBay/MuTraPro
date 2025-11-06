package com.mutrapro.media_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mutrapro.media_service.model.MediaFile;
import com.mutrapro.media_service.repository.MediaFileRepository;

@Service
public class MediaFileService {

    private final MediaFileRepository mediaFileRepository;

    public MediaFileService(MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
    }

    public MediaFile uploadFile(MultipartFile file, Long ownerUserId, Long entityId, String entityType, String storageUrl) throws IOException {
        MediaFile mediaFile = new MediaFile();
        mediaFile.setOwnerUserId(ownerUserId);
        mediaFile.setEntityId(entityId);
        mediaFile.setEntityType(entityType);
        mediaFile.setFileName(file.getOriginalFilename());
        mediaFile.setMimeType(file.getContentType());
        mediaFile.setSizeInBytes(file.getSize());
        mediaFile.setStorageUrl(storageUrl);

        return mediaFileRepository.save(mediaFile);
    }

    public List<MediaFile> getFilesByOwner(Long ownerUserId) {
        return mediaFileRepository.findByOwnerUserId(ownerUserId);
    }

    public List<MediaFile> getFilesByEntity(Long entityId, String entityType) {
        return mediaFileRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    public Optional<MediaFile> getFileById(UUID fileId) {
        return mediaFileRepository.findById(fileId);
    }

    public void deleteFile(UUID fileId) {
        mediaFileRepository.deleteById(fileId);
    }
}

