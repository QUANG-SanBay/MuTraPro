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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "Orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Long id;

    @Column(name = "OrderDate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @Column(name = "TotalAmount")
    private Double totalAmount;

    @Column(name = "lanCuoiCapNhat")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lanCuoiCapNhat;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai")
    private OrderStatus trangThai;

    @Column(name = "OrderType")
    private String orderType;

    @Column(name = "CustomerName")
    private String customerName;

    @Column(name = "Email")
    private String email;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Tags")
    private String tags;

    @Column(name = "FilePath")
    private String filePath;

    @Column(name = "RequestCode")
    private String requestCode;

    // Getters / Setters
    public Long getId() { return id; }

    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Date getLanCuoiCapNhat() { return lanCuoiCapNhat; }
    public void setLanCuoiCapNhat(Date lanCuoiCapNhat) { this.lanCuoiCapNhat = lanCuoiCapNhat; }

    public OrderStatus getTrangThai() { return trangThai; }
    public void setTrangThai(OrderStatus trangThai) { this.trangThai = trangThai; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getRequestCode() { return requestCode; }
    public void setRequestCode(String requestCode) { this.requestCode = requestCode; }
}
