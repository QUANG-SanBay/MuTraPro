package com.mutrapro.media_service.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "MediaFile")
public class MediaFile {

    @Id
    @GeneratedValue
    @Column(name = "IDfile")
    private UUID idfile;

    @Column(name = "IDUser", nullable = false)
    private Long ownerUserId;

    @Column(name = "NameFile", nullable = false)
    private String nameFile;

    @Column(name = "IDEntity", nullable = false)
    private Long entityId;

    @Column(name = "TypeEntity", nullable = false)
    private String entityType;

    @Column(name = "UrlStorage", nullable = false)
    private String urlStorage;

    @Column(name = "Typemime")
    private String typemime;

    @Column(name = "sizeInBytes")
    private Long sizeInBytes;

    @Column(name = "uploadTimestamp")
    private LocalDateTime uploadTimestamp = LocalDateTime.now();

    @Column(name = "status")
    private String status = "Chờ xử lý";

    @Column(name = "progress")
    private Integer progress = 0;

    // Getters & Setters
    public UUID getIdfile() { return idfile; }
    public void setIdfile(UUID idfile) { this.idfile = idfile; }

    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }

    public String getNameFile() { return nameFile; }
    public void setNameFile(String nameFile) { this.nameFile = nameFile; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getUrlStorage() { return urlStorage; }
    public void setUrlStorage(String urlStorage) { this.urlStorage = urlStorage; }

    public String getTypemime() { return typemime; }
    public void setTypemime(String typemime) { this.typemime = typemime; }

    public Long getSizeInBytes() { return sizeInBytes; }
    public void setSizeInBytes(Long sizeInBytes) { this.sizeInBytes = sizeInBytes; }

    public LocalDateTime getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(LocalDateTime uploadTimestamp) { this.uploadTimestamp = uploadTimestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
}
