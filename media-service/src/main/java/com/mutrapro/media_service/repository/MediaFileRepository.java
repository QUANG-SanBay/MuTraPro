package com.mutrapro.media_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mutrapro.media_service.model.MediaFile;

import java.util.UUID;
import java.util.List;

public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
    List<MediaFile> findByOwnerUserId(Long ownerUserId);
    List<MediaFile> findByEntityIdAndEntityType(Long entityId, String entityType);
}
