package com.mutrapro.studio.repository;

import com.mutrapro.studio.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudioRepository extends JpaRepository<Studio, Long> {
    List<Studio> findByActiveTrue();
}
