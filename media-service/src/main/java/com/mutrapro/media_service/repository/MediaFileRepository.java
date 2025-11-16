package com.mutrapro.media_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mutrapro.media_service.model.MediaFile;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {

    // FIX LỖI 500: Đã loại bỏ @Query Native Query. 
    // Spring Data JPA sẽ tự động tạo truy vấn JPQL: 
    // SELECT m FROM MediaFile m WHERE m.ownerUserId = ?1 (chính xác và an toàn)
    List<MediaFile> findByOwnerUserId(Long ownerUserId); 

    // Giữ nguyên phương thức này
    @Query(value = "SELECT * FROM MediaFile WHERE IDEntity = :entityId AND TypeEntity = :entityType", nativeQuery = true)
    List<MediaFile> findByEntityIdAndEntityType(@Param("entityId") Long entityId,
                                                @Param("entityType") String entityType);
}