package com.mutrapro.order_service.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_request_files")
public class ServiceRequestFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String fileName;
    private String filePath;

    @OneToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    // ===== Getters & Setters =====
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
