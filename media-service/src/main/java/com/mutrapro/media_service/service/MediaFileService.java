package com.mutrapro.media_service.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mutrapro.media_service.model.MediaFile;
import com.mutrapro.media_service.repository.MediaFileRepository;

@Service
public class MediaFileService {

    private final MediaFileRepository mediaFileRepository;

    public MediaFileService(MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
    }

    public MediaFile uploadFile(MultipartFile file, Long ownerUserId, Long entityId, String entityType, String urlStorage) throws IOException {
        MediaFile mf = new MediaFile();
        mf.setOwnerUserId(ownerUserId);
        mf.setEntityId(entityId);
        mf.setEntityType(entityType);
        mf.setNameFile(file.getOriginalFilename());
        mf.setUrlStorage(urlStorage);
        mf.setTypemime(file.getContentType());
        mf.setSizeInBytes(file.getSize());
        mf.setStatus("Chờ xử lý");
        mf.setProgress(0);
        return mediaFileRepository.save(mf);
    }

    public Optional<MediaFile> getFileById(UUID fileId) {
        return mediaFileRepository.findById(fileId);
    }

    public List<MediaFile> getFilesByOwner(Long ownerUserId) {
        return mediaFileRepository.findByOwnerUserId(ownerUserId);
    }

    public List<MediaFile> getFilesByEntity(Long entityId, String entityType) {
        return mediaFileRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    public void deleteFile(UUID fileId) {
        mediaFileRepository.deleteById(fileId);
    }
}
