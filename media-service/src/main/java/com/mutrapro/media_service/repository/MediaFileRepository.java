package com.mutrapro.media_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mutrapro.media_service.model.AccessLevel;
import com.mutrapro.media_service.model.MediaFile;

public interface MediaFileRepository extends JpaRepository<MediaFile, String> {
    List<MediaFile> findByAccessLevel(AccessLevel accessLevel);
}
