package com.mutrapro.media_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class MediaFile {

    @Id
    @GeneratedValue
    private UUID fileId;

    private Long ownerUserId;
    private Long entityId;
    private String entityType;
    private String fileName;
    private String storageUrl;
    private String mimeType;
    private Long sizeInBytes;
    private LocalDateTime uploadTimestamp;

    @Enumerated(EnumType.STRING)
    private AccessLevel accessLevel;

    public MediaFile() {
        this.uploadTimestamp = LocalDateTime.now();
    }

    public String generatePresignedUrl() {
        return storageUrl + "?token=" + UUID.randomUUID();
    }

    // Getters & Setters
    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getStorageUrl() { return storageUrl; }
    public void setStorageUrl(String storageUrl) { this.storageUrl = storageUrl; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public Long getSizeInBytes() { return sizeInBytes; }
    public void setSizeInBytes(Long sizeInBytes) { this.sizeInBytes = sizeInBytes; }

    public LocalDateTime getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(LocalDateTime uploadTimestamp) { this.uploadTimestamp = uploadTimestamp; }

    public AccessLevel getAccessLevel() { return accessLevel; }
    public void setAccessLevel(AccessLevel accessLevel) { this.accessLevel = accessLevel; }
}
