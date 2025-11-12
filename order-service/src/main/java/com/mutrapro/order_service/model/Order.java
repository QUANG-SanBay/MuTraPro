package com.mutrapro.order_service.model;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer id;

    @Column(name = "CustomerID", nullable = false)
    private Integer customerId;

    @Column(name = "OrderDate")
    private Date thoiGianTao;

    @Column(name = "TotalAmount")
    private double tongTien;

    @Enumerated(EnumType.STRING)
    private OrderStatus trangThai;

    private Date lanCuoiCapNhat;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ServiceRequestFile serviceRequestFile;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @Column(name = "SongName")
    private String songName;

    @Column(name = "Note")
    private String note;

    // ===== Getters & Setters =====
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Date getThoiGianTao() { return thoiGianTao; }
    public void setThoiGianTao(Date thoiGianTao) { this.thoiGianTao = thoiGianTao; }

    public double getTongTien() { return tongTien; }
    public void setTongTien(double tongTien) { this.tongTien = tongTien; }

    public OrderStatus getTrangThai() { return trangThai; }
    public void setTrangThai(OrderStatus trangThai) { this.trangThai = trangThai; }

    public Date getLanCuoiCapNhat() { return lanCuoiCapNhat; }
    public void setLanCuoiCapNhat(Date lanCuoiCapNhat) { this.lanCuoiCapNhat = lanCuoiCapNhat; }

    public ServiceRequestFile getServiceRequestFile() { return serviceRequestFile; }
    public void setServiceRequestFile(ServiceRequestFile serviceRequestFile) {
        this.serviceRequestFile = serviceRequestFile;
        if (serviceRequestFile != null) {
            serviceRequestFile.setOrder(this);
        }
    }

    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }

    public String getSongName() { return songName; }
    public void setSongName(String songName) { this.songName = songName; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    // ===== Logic helper =====
    public void tinhTongTien() {
        this.tongTien = 100000; // hoặc logic tính tổng tiền thực tế
    }

    public void capNhatTrangThai(OrderStatus status) {
        this.trangThai = status;
        this.lanCuoiCapNhat = new Date();
    }
}
