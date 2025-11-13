import React, { useState } from "react";
import "./TaskDetail.css";

const TaskDetail = () => {
  const [activeTab, setActiveTab] = useState("work");
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState("");
  const [lastSaved, setLastSaved] = useState({ progress: 0, note: "" });
  const [showSaved, setShowSaved] = useState(false);
  const [showNoChange, setShowNoChange] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checklist, setChecklist] = useState([false, false, false]);
  const [uploadError, setUploadError] = useState("");
  const [playingIndex, setPlayingIndex] = useState(null);
  
  const task = {
    id: "TASK001",
    customer: "Nguyễn Văn A",
    title: "Thực hiện kỹ âm",
    subtitle: "Nhiệm vụ: Mùa hạ rực rỡ",
    deadline: "26/01/2025",
    description:
      "Chuyển đổi file âm thanh thành bản ký âm chính xác cho bài hát pop",
    note: "Cần chú ý phần harmony và melody phức tạp ở đoạn bridge",
    files: [
      { name: "audio-demo.mp3", type: "audio", size: "4.2 MB" },
      { name: "reference.pdf", type: "doc", size: "1.1 MB" },
    ],
  };

  // ------------------ HANDLE ------------------
  const handleSaveDraft = () => {
    if (progress === lastSaved.progress && note.trim() === lastSaved.note.trim()) {
      setShowNoChange(true);
      setTimeout(() => setShowNoChange(false), 3000);
      return;
    }
    setLastSaved({ progress, note });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const toggleProgress = (val) => setProgress((prev) => (prev === val ? 0 : val));

  const handleFileSelect = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    setUploadError("");
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index] = value;
    setChecklist(newChecklist);
  };

  const handleSendUpload = () => {
    if (selectedFiles.length === 0) {
      setUploadError("⚠️ Bạn chưa upload file nào!");
      return;
    }
    console.log("Gửi sản phẩm:", { files: selectedFiles, note, checklist });
    alert("Upload thành công!");
    setSelectedFiles([]);
    setChecklist([false, false, false]);
    setNote("");
    setUploadError("");
  };

  // ------------------ RENDER ------------------
  return (
    <div className="task-detail-container">
      {/* HEADER */}
      <div className="task-header">
        <div>
          <h2>{task.title}</h2>
          <p className="task-subtitle">{task.subtitle}</p>
        </div>
        <div className="task-deadline">Hạn: {task.deadline}</div>
      </div>

      {/* TASK INFO */}
      <div className="task-info-card">
        <div className="task-info-row">
          <div className="task-info-item">
            <p className="label">Mã nhiệm vụ</p>
            <p className="value">{task.id}</p>
          </div>
          <div className="task-info-item">
            <p className="label">Khách hàng</p>
            <p className="value">{task.customer}</p>
          </div>
        </div>

        <div className="task-info-desc">
          <p className="label">Mô tả</p>
          <p className="value">{task.description}</p>
        </div>
      </div>

      {/* FILES */}
      <div className="task-files">
        <p className="label">File gốc từ khách hàng</p>
        {task.files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="clickable-file">
              {file.type === "audio" ? "🎵" : "📄"} {file.name} ({file.size})
            </span>
          <div className="file-actions">
                {file.type === "audio" && (
                  <button
                    className="btn-play" onClick={() =>
                      setPlayingIndex((prev) => (prev === index ? null : index))
                    }
                  >
                    {playingIndex === index ? "⏸" : "▶"}
                  </button>
                )}
              <button className="btn-download">Tải về</button>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="task-tabs">
        <div
          className={`tab ${activeTab === "work" ? "active" : ""}`}
          onClick={() => setActiveTab("work")}
        >
          Làm việc
        </div>
        <div
          className={`tab ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload kết quả
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "work" && (
        <div className="tab-content task-work">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}%</p>
          </div>

          <div className="progress-buttons">
            {[25, 50, 75, 100].map((val) => (
              <button key={val} className={progress === val ? "active" : ""} onClick={() => toggleProgress(val)}>
                {val}%
              </button>
            ))}
          </div>

          <div className="task-note">
            <p className="label">Ghi chú công việc</p>
            <textarea
              placeholder="Thêm ghi chú quá trình làm việc, vấn đề gặp phải..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <div className="task-actions">
            <button className="btn-draft" onClick={handleSaveDraft}>Lưu nháp</button>
            <button className="btn-upload" onClick={() => setActiveTab("upload")}>Chuyển sang Upload</button>
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="tab-content task-upload-container">
          <div className="upload-header">
            <h2>Upload file ký âm</h2>
            <p>Định dạng hỗ trợ: MusicXML, PDF, MIDI</p>
          </div>

          <div className="upload-box" onClick={() => document.getElementById("fileInput").click()}>
            <div className="upload-icon">⬆️</div>
            <p>Kéo thả file vào đây hoặc</p>
            <button className="select-file-btn">Chọn file từ máy tính</button>
            <input
              type="file"
              id="fileInput"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <p className="small-text">Kích thước tối đa: 500MB mỗi file</p>
          </div>

          {selectedFiles.length > 0 && (
            <ul className="selected-file-list">
              {selectedFiles.map((file, i) => (
                <li key={i}>
                  {file.name} <span onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))}>❌</span>
                </li>
              ))}
            </ul>
          )}

          <div className="upload-note">
            <textarea placeholder="Thêm ghi chú cho khách hàng (tùy chọn)" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
          </div>

          <div className="upload-checklist">
            <p>Kiểm tra trước khi gửi:</p>
            {["Đã kiểm tra chất lượng sản phẩm", "Đúng định dạng yêu cầu", "Đặt tên file rõ ràng"].map((item, i) => (
              <label key={i} className="check-item">
                <input type="checkbox" checked={checklist[i]} onChange={(e) => handleChecklistChange(i, e.target.checked)} />
                <span className="checkmark"></span>
                {item}
              </label>
            ))}
          </div>

          {uploadError && <div className="upload-error">{uploadError}</div>}

          <div className="upload-actions">
            <button onClick={() => setActiveTab("work")}>Hủy</button>
            <button onClick={handleSendUpload}>Gửi sản phẩm</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showSaved && <div className="saved-toast">✅ Đã lưu nháp</div>}
      {showNoChange && <div className="saved-toast warning">⚠️ Bản nháp đã có sẵn, không có thay đổi nào</div>}
    </div>
  );
};

export default TaskDetail;
