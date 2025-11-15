import React, { useState } from "react";
import styles from "./ProductApproval.module.scss";
import { FaPlay, FaDownload, FaCheckCircle } from "react-icons/fa";

const ProductApproval = () => {
  const [status, setStatus] = useState("waitingApproval");
  const [feedback, setFeedback] = useState("");

  const handleRequestEdit = () => setStatus("requestChange");
  const handleCancel = () => setStatus("waitingApproval");
  const handleApprove = () => {
    alert(" Sản phẩm đã được phê duyệt!");
    setStatus("approved");
  };
  const handleSubmitRequest = () => {
    if (!feedback.trim()) return alert("Vui lòng nhập chi tiết cần chỉnh sửa!");
    alert("📨 Yêu cầu chỉnh sửa đã được gửi!");
    setStatus("waitingApproval");
    setFeedback("");
  };

  return (
    <div className={styles.container}>
      <h3>Phê duyệt sản phẩm</h3>
      <p className={styles.subTitle}>
        Xem và yêu cầu chỉnh sửa sản phẩm của bạn
      </p>

      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h4>Đêm Noel</h4>
            <span className={styles.badge}>Chờ phê duyệt</span>
            <p className={styles.meta}>Mã đơn: ORD002 • Mix nhạc • 14/10/2025</p>
          </div>
        </div>

        <div className={styles.preview}>
          <p>Vui lòng nghe thử sản phẩm và phê duyệt hoặc yêu cầu chỉnh sửa nếu cần.</p>
          <div className={styles.audioBox}>
            <div className={styles.audioInfo}>
              <FaPlay /> <span>Đêm noel.mp3</span>
              <p>Sản phẩm hoàn thiện</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnOutline}><FaPlay /> Nghe thử</button>
              <button className={styles.btnOutline}><FaDownload /> Tải về</button>
            </div>
          </div>
        </div>

        {status === "waitingApproval" && (
          <div className={styles.actionGroup}>
            <button className={styles.btnSecondary} onClick={handleRequestEdit}>
              Yêu cầu chỉnh sửa
            </button>
            <button className={styles.btnPrimary} onClick={handleApprove}>
              <FaCheckCircle /> Phê duyệt
            </button>
          </div>
        )}

        {status === "requestChange" && (
          <div className={styles.requestBox}>
            <label>Yêu cầu chỉnh sửa</label>
            <textarea
              placeholder="Nhập chi tiết những điểm cần chỉnh sửa..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className={styles.actionGroup}>
              <button onClick={handleCancel} className={styles.btnSecondary}>Hủy</button>
              <button onClick={handleSubmitRequest} className={styles.btnDark}>Gửi yêu cầu</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductApproval;
