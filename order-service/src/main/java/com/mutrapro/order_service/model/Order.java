package com.mutrapro.order_service.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Orders") // Tên bảng đúng trong SQL Server (có O viết hoa)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Vì OrderID là IDENTITY(1,1)
    @Column(name = "OrderID")
    private Integer id;

    @Column(name = "CustomerID", nullable = false)
    private Integer customerId;

    @Column(name = "OrderDate")
    private Date thoiGianTao;

    @Column(name = "TotalAmount")
    private double tongTien;

    // Các trường mới do bạn thêm (không có trong bảng thật)
    // Nếu muốn Hibernate thêm tự động thì giữ lại
    // Nếu không thì comment lại để tránh lỗi
    @Enumerated(EnumType.STRING)
    private OrderStatus trangThai;

    private Date lanCuoiCapNhat;

    // ===================== GETTERS & SETTERS =====================
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Date getThoiGianTao() {
        return thoiGianTao;
    }

    public void setThoiGianTao(Date thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }

    public double getTongTien() {
        return tongTien;
    }

    public void setTongTien(double tongTien) {
        this.tongTien = tongTien;
    }

    public OrderStatus getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(OrderStatus trangThai) {
        this.trangThai = trangThai;
    }

    public Date getLanCuoiCapNhat() {
        return lanCuoiCapNhat;
    }

    public void setLanCuoiCapNhat(Date lanCuoiCapNhat) {
        this.lanCuoiCapNhat = lanCuoiCapNhat;
    }

    // ===================== LOGIC =====================
    public void tinhTongTien() {
        this.tongTien = 100000; // tạm tính
    }

    public void capNhatTrangThai(OrderStatus status) {
        this.trangThai = status;
        this.lanCuoiCapNhat = new Date();
    }
}
