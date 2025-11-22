import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
// Cần thêm Font Awesome vào dự án nếu chưa có
// Ví dụ: import '@fortawesome/fontawesome-free/css/all.min.css';

// -------------------------------------------------------------
// COMPONENT MỚI: Modal Chi tiết đơn hàng
// -------------------------------------------------------------
const OrderDetailModal = ({ order, statusInfo, onClose }) => {
    if (!order) return null;

    // Định dạng ngày: DD/MM/YYYY
    const formattedDate = new Date(order.uploadTimestamp).toLocaleDateString("vi-VN", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, '/');
    
    // Sử dụng class CSS tương ứng với trạng thái
    const progressClassName = statusInfo.status === "Hoàn thành" ? "completed" : "";

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Chi tiết đơn hàng</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <p className="modal-subtitle">Thông tin chi tiết về đơn hàng **{order.orderId}**</p>
                
                {/* Body - Dạng lưới 2 cột */}
                <div className="modal-info-grid">
                    <div className="info-pair">
                        <span className="info-label">Tên bài hát</span>
                        <span className="info-value">{order.nameFile}</span>
                    </div>
                    <div className="info-pair">
                        <span className="info-label">Mã đơn</span>
                        <span className="info-value">{order.orderId}</span>
                    </div>

                    <div className="info-pair">
                        <span className="info-label">Dịch vụ</span>
                        <span className="info-value">{order.entityType}</span>
                    </div>
                    <div className="info-pair">
                        <span className="info-label">Ngày đặt</span>
                        <span className="info-value">{formattedDate}</span>
                    </div>
                    
                    {/* Trạng thái */}
                    <div className="full-width-section">
                        <span className="info-label">Trạng thái</span>
                        <div className={`status-modal ${statusInfo.className}`}>
                            <i className={statusInfo.icon}></i> {statusInfo.text}
                        </div>
                    </div>
                    
                    {/* Tiến độ */}
                    <div className="full-width-section progress-display">
                        <span className="info-label">Tiến độ xử lý</span>
                        <div className="progress-bar-container modal-progress-container">
                            <div className={`progress-bar ${progressClassName}`} style={{ width: `${order.progress}%` }}></div>
                        </div>
                        <span className="progress-percent-modal">{order.progress}%</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
// -------------------------------------------------------------

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ---- BẬT/DỪNG MOCK DATA ----
    const useMockData = true; // Giữ nguyên giá trị của bạn

    useEffect(() => {
        // Logic gọi API hoặc sử dụng Mock Data được giữ nguyên
        if (useMockData) {
            const mockData = [
                {
                    idfile: "ORD003-CC880G89",
                    nameFile: "Tình ca",
                    entityType: "Mastering", // Dịch vụ
                    status: "Hoàn thành",
                    progress: 100,
                    uploadTimestamp: "2025-11-14T08:30:15.000",
                    orderId: "ORD003"
                },
                {
                    idfile: "ORD001-AA660E67",
                    nameFile: "Bài hát mùa hè",
                    entityType: "Thu âm + Mix + Master",
                    status: "Đang xử lý",
                    progress: 60,
                    uploadTimestamp: "2025-11-10T15:51:33.280",
                    orderId: "ORD001"
                },
                {
                    idfile: "ORD002-BB770F78",
                    nameFile: "Đêm noel",
                    entityType: "Mix nhạc",
                    status: "Chờ phê duyệt",
                    progress: 90,
                    uploadTimestamp: "2025-11-12T10:20:00.000",
                    orderId: "ORD002"
                },
                {
                    idfile: "ORD004-DD990H90",
                    nameFile: "Ballad buồn",
                    entityType: "Thu âm",
                    status: "Chờ xử lý",
                    progress: 10,
                    uploadTimestamp: "2025-11-15T12:00:00.000",
                    orderId: "ORD004"
                }
            ];

            setOrders(mockData);
            setLoading(false);
        } else {
            // Logic gọi API thật (đã được giữ nguyên)
            fetch("http://localhost:4004/media")
                .then(res => {
                    if (!res.ok) {
                        console.error("Lỗi API/HTTP:", res.status);
                        throw new Error('Network response was not ok'); 
                    }
                    return res.json();
                })
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi kết nối API:", err);
                    setOrders([]);
                    setLoading(false);
                });
        }
    }, [useMockData]);

    // Hàm xác định Class CSS và Icon dựa trên trạng thái (như hình gốc)
    const getStatusInfo = (status) => {
        switch (status) {
            case "Hoàn thành": 
                return { 
                    className: "status completed", 
                    text: "Hoàn thành",
                    icon: "fas fa-check-circle",
                    status: "Hoàn thành"
                };
            case "Đang xử lý": 
                return { 
                    className: "status processing", 
                    text: "Đang xử lý",
                    icon: "fas fa-cog",
                    status: "Đang xử lý"
                };
            case "Chờ phê duyệt": 
                return { 
                    className: "status pending", 
                    text: "Chờ phê duyệt",
                    icon: "fas fa-clock",
                    status: "Chờ phê duyệt"
                };
            case "Chờ xử lý": 
                return { 
                    className: "status new", 
                    text: "Chờ xử lý",
                    icon: "fas fa-hourglass-start",
                    status: "Chờ xử lý"
                };
            default: 
                return { 
                    className: "status", 
                    text: status,
                    icon: "",
                    status: status
                };
        }
    };
    
    // Hàm xử lý khi nhấn nút Chi tiết
    const handleDetailClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const selectedStatusInfo = selectedOrder ? getStatusInfo(selectedOrder.status) : {};

    return (
        <>
            <div className="order-tracker-container">
                <h2 className="tracking-title">Theo dõi đơn hàng</h2>
                <p className="tracker-subtitle">Xem tiến độ và trạng thái các đơn hàng của bạn</p>

                {loading ? (
                    <div className="loading">Đang tải dữ liệu...</div>
                ) : orders.length === 0 ? (
                    <div className="no-data">Không có đơn hàng nào.</div>
                ) : (
                    orders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const formattedDate = new Date(order.uploadTimestamp).toLocaleDateString("vi-VN", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }).replace(/\//g, '/');

                        return (
                            <div key={order.idfile} className={`order-item ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                                <div className="order-header">
                                    {/* Trạng thái (Box có màu) */}
                                    <span className={statusInfo.className}>
                                        {statusInfo.text}
                                    </span>
                                    {/* Tên file */}
                                    <span className="order-title">{order.nameFile}</span>
                                    {/* Nút Chi tiết */}
                                    <button 
                                        className="detail-btn"
                                        onClick={() => handleDetailClick(order)} // Thêm onClick
                                    >
                                        <i className="fas fa-eye detail-icon"></i>
                                        Chi tiết
                                    </button>
                                </div>
                                {/* ... phần còn lại của item ... */}
                                <p className="order-info">
                                    Mã đơn: {order.orderId} • {order.entityType} • {formattedDate}
                                </p>
                                <div className="progress-section">
                                    <span className="progress-label">Tiến độ</span>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar" style={{ width: `${order.progress}%` }}></div>
                                        <span className="progress-percent">{order.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Component Modal */}
            {showModal && (
                <OrderDetailModal 
                    order={selectedOrder}
                    statusInfo={selectedStatusInfo}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default OrderTracking;