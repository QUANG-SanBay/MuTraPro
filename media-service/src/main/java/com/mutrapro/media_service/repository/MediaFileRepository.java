package com.mutrapro.media_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mutrapro.media_service.model.MediaFile;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
    List<MediaFile> findByOwnerUserId(Long ownerUserId);
    List<MediaFile> findByEntityIdAndEntityType(Long entityId, String entityType);
}
