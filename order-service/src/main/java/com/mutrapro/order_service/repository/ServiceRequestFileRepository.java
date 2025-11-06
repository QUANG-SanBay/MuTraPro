package com.mutrapro.order_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mutrapro.order_service.model.ServiceRequestFile;

public interface ServiceRequestFileRepository extends JpaRepository<ServiceRequestFile, UUID> {}
