import React, { useState } from "react";
import "./TaskDetail.css";

const TaskDetail = () => {
  const [progress, setProgress] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  const task = {
    id: "TASK001",
    customer: "Nguyễn Văn A",
    title: "Thực hiện kỹ âm",
    subtitle: "Nhiệm vụ: Mùa hạ rực rỡ",
    deadline: "26/01/2025",
    description: "Chuyển đổi file âm thanh thành bản ký âm chính xác cho bài hát pop",
    note: "Cần chú ý phần harmony và melody phức tạp ở đoạn bridge",
    files: [
      { name: "audio-demo.mp3", type: "audio", size: "4.2 MB" },
      { name: "reference.pdf", type: "doc", size: "1.1 MB" },
    ],
  };

  const handleSaveDraft = () => {
    const note = document.querySelector(".task-note textarea").value;
    console.log("Lưu nháp:", { progress, note });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000); // 3 giây tự ẩn
  };

  const handleUpload = () => {
    const note = document.querySelector(".task-note textarea").value;
    console.log("Chuyển sang Upload:", { progress, note });
    setIsUpload(true); // Chuyển sang UI upload
  };

  if (isUpload) {
    // Giao diện Upload file
    return (
      <div className="task-upload-container">
        <h2>Upload file ký âm</h2>
        <p>Định dạng hỗ trợ: MusicXML, PDF, MIDI</p>
        <div className="upload-box">
          <div className="upload-icon">⬆️</div>
          <p>Kéo thả file vào đây hoặc</p>
          <button>Chọn file từ máy tính</button>
          <p>Kích thước tối đa: 500MB mỗi file</p>
        </div>
        <div className="upload-note">
          <textarea placeholder="Thêm ghi chú cho khách hàng (tùy chọn)"></textarea>
        </div>
        <div className="upload-checklist">
          <p>Kiểm tra trước khi gửi:</p>
          <ul>
            <li>✅ Đã kiểm tra chất lượng sản phẩm</li>
            <li>✅ Đúng định dạng yêu cầu</li>
            <li>✅ Đặt tên file rõ ràng</li>
          </ul>
        </div>
        <div className="upload-actions">
          <button>Hủy</button>
          <button>Gửi sản phẩm</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-container">
      {/* Header */}
      <div className="task-header">
        <div>
          <h2>{task.title}</h2>
          <p className="task-subtitle">{task.subtitle}</p>
        </div>
        <div className="task-deadline">
          <span>Hạn: {task.deadline}</span>
        </div>
      </div>

      {/* Thông tin nhiệm vụ */}
      <div className="task-info">
        <div className="task-row">
          <div>
            <p className="label">Mã nhiệm vụ</p>
            <p className="value">{task.id}</p>
          </div>
          <div>
            <p className="label">Khách hàng</p>
            <p className="value">{task.customer}</p>
          </div>
        </div>

        <div className="task-desc">
          <p className="label">Mô tả</p>
          <p>{task.description}</p>
        </div>

        <div className="task-special">
          <p className="label">Yêu cầu đặc biệt</p>
          <textarea readOnly value={task.note}></textarea>
        </div>

        <div className="task-files">
          <p className="label">File gốc từ khách hàng</p>
          {task.files.map((file, index) => (
            <div key={index} className="file-item">
              <span>
                {file.type === "audio" ? "🎵" : "📄"} {file.name} ({file.size})
              </span>
              <div className="file-actions">
                {file.type === "audio" && <button className="btn-play">▶</button>}
                <button className="btn-download">Tải về</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="task-tabs">
        <button className="tab active">Làm việc</button>
        <button className="tab">Upload kết quả</button>
      </div>

      {/* Work Section */}
      <div className="task-work">
        <p className="label">Tiến độ công việc</p>
        <p className="desc">
          Cập nhật tiến độ và ghi chú trong quá trình làm việc
        </p>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>

        <div className="progress-buttons">
          {[25, 50, 75, 100].map((val) => (
            <button
              key={val}
              className={progress === val ? "active" : ""}
              onClick={() => setProgress(val)}
            >
              {val}%
            </button>
          ))}
        </div>

        <div className="task-note">
          <p className="label">Ghi chú công việc</p>
          <textarea placeholder="Thêm ghi chú quá trình làm việc, vấn đề gặp phải..."></textarea>
        </div>

        <div className="task-actions">
          <button className="btn-draft" onClick={handleSaveDraft}>
            Lưu nháp
          </button>
          <button className="btn-upload" onClick={handleUpload}>
            Chuyển sang Upload
          </button>
        </div>
      </div>

      {/* Hiển thị thông báo đã lưu */}
      {showSaved && <div className="saved-toast">✅ Đã lưu nháp</div>}
    </div>
  );
};

export default TaskDetail;
