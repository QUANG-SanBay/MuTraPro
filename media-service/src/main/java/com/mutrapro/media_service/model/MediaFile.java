package com.mutrapro.media_service.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "media_file")
public class MediaFile {

    @Id
    @Column(name = "id_file", nullable = false, updatable = false)
    private String idFile;

    @Column(name = "id_user", nullable = false)
    private Long idUser;

    @Column(name = "name_file", nullable = false)
    private String nameFile;

    @Column(name = "id_entity")
    private Long idEntity;

    @Column(name = "type_entity")
    private String typeEntity;

    @Column(name = "url_storage")
    private String urlStorage;

    @Column(name = "typemime")
    private String typeMime;

    @Column(name = "size_in_bytes")
    private String sizeInBytes;

    @Column(name = "upload_timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime uploadTimestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", nullable = false)
    private AccessLevel accessLevel;

    // ===== Constructor rỗng =====
    public MediaFile() {
    }

    // ===== Constructor đầy đủ =====
    public MediaFile(String idFile, Long idUser, String nameFile, Long idEntity,
                     String typeEntity, String urlStorage, String typeMime,
                     String sizeInBytes, LocalDateTime uploadTimestamp, AccessLevel accessLevel) {
        this.idFile = idFile;
        this.idUser = idUser;
        this.nameFile = nameFile;
        this.idEntity = idEntity;
        this.typeEntity = typeEntity;
        this.urlStorage = urlStorage;
        this.typeMime = typeMime;
        this.sizeInBytes = sizeInBytes;
        this.uploadTimestamp = uploadTimestamp;
        this.accessLevel = accessLevel;
    }

    // ===== GETTER/SETTER =====
    public String getIdFile() {
        return idFile;
    }

    public void setIdFile(String idFile) {
        this.idFile = idFile;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getNameFile() {
        return nameFile;
    }

    public void setNameFile(String nameFile) {
        this.nameFile = nameFile;
    }

    public Long getIdEntity() {
        return idEntity;
    }

    public void setIdEntity(Long idEntity) {
        this.idEntity = idEntity;
    }

    public String getTypeEntity() {
        return typeEntity;
    }

    public void setTypeEntity(String typeEntity) {
        this.typeEntity = typeEntity;
    }

    public String getUrlStorage() {
        return urlStorage;
    }

    public void setUrlStorage(String urlStorage) {
        this.urlStorage = urlStorage;
    }

    public String getTypeMime() {
        return typeMime;
    }

    public void setTypeMime(String typeMime) {
        this.typeMime = typeMime;
    }

    public String getSizeInBytes() {
        return sizeInBytes;
    }

    public void setSizeInBytes(String sizeInBytes) {
        this.sizeInBytes = sizeInBytes;
    }

    public LocalDateTime getUploadTimestamp() {
        return uploadTimestamp;
    }

    public void setUploadTimestamp(LocalDateTime uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }

    public AccessLevel getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevel accessLevel) {
        this.accessLevel = accessLevel;
    }

    // ===== Tự sinh UUID nếu không có =====
    public void ensureId() {
        if (this.idFile == null || this.idFile.isEmpty()) {
            this.idFile = UUID.randomUUID().toString();
        }
    }

    // ===== URL truy cập file =====
    public String generatePresignedUrl() {
        return "https://storage.mutrapro.com/media/" + idFile;
    }
}
