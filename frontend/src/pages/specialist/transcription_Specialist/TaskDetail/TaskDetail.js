import React, { useState, useRef, useEffect } from "react";
import "./TaskDetail.css";

const USE_MOCK = true; // true = dùng dữ liệu ảo, false = dùng dữ liệu thật từ API

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
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const audioRef = useRef(null);

  const [task, setTask] = useState(USE_MOCK ? {
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
  } : null);

  // Khi dùng dữ liệu thật
  useEffect(() => {
    if (!USE_MOCK) {
      fetch("/api/task/1") // endpoint ví dụ, thay theo backend
        .then(res => res.json())
        .then(data => setTask(data))
        .catch(err => console.error(err));
    }
  }, []);

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

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index] = value;
    setChecklist(newChecklist);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.size <= 500 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setUploadError("⚠️ Một số file quá lớn, tối đa 500MB mỗi file");
    } else {
      setUploadError("");
    }
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const handleSendUpload = () => {
    // Kiểm tra file
    if (selectedFiles.length === 0) {
      setUploadError("⚠️ Bạn chưa upload file nào!");
      return;
    }

    // Kiểm tra checklist
    if (checklist.some((checked) => !checked)) {
      setUploadError("⚠️ Vui lòng tích hết các mục kiểm tra trước khi gửi!");
      return;
    }

    if (USE_MOCK) {
    // Dữ liệu ảo: chỉ hiển thị toast
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
    } 
    
    else {
    // Dữ liệu thật: gửi lên backend
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("note", note);
    formData.append("checklist", JSON.stringify(checklist));
    // Giả sử endpoint là /api/media/upload
    fetch("/media/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload thất bại");
        return res.json();
      })
      .then((data) => {
        setShowUploadSuccess(true);
        setTimeout(() => setShowUploadSuccess(false), 3000);
        // Reset form
        setSelectedFiles([]);
        setChecklist([false, false, false]);
        setNote("");
        setUploadError("");
      })
      .catch((err) => {
        console.error(err);
        setUploadError("⚠️ Có lỗi xảy ra khi gửi sản phẩm!");
      });
  }

    console.log("Gửi sản phẩm:", { files: selectedFiles, note, checklist });

    // Hiển thị toast thành công
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);

    // Reset form
    setSelectedFiles([]);
    setChecklist([false, false, false]);
    setNote("");
    setUploadError("");
  };

  const handlePlayPause = (index, file) => {
    if (playingIndex === index) {
      setPlayingIndex(null); // pause
      if (!USE_MOCK && audioRef.current) audioRef.current.pause();
    } else {
      setPlayingIndex(index); // play
      if (!USE_MOCK && audioRef.current) {
        audioRef.current.src = file.url;
        audioRef.current.play();
      }
    }
  };

  const handleDownload = (file) => {
    if (USE_MOCK) {
      setDownloadFileName(file.name);
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
      return;
    }
    // Khi dữ liệu thật: fetch từ API
    fetch(`/media/download/${file.id}`)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  // ------------------ RENDER ------------------
  return (
    <div className="task-detail-container">
      {/* HEADER */}
      <div className="task-header">
        <div>
          <h2>{task?.title}</h2>
          <p className="task-subtitle">{task?.subtitle}</p>
        </div>
        <div className="task-deadline">Hạn: {task?.deadline}</div>
      </div>

      {/* TASK INFO */}
      <div className="task-info-card">
        <div className="task-info-row">
          <div className="task-info-item">
            <p className="label">Mã nhiệm vụ</p>
            <p className="value">{task?.id}</p>
          </div>
          <div className="task-info-item">
            <p className="label">Khách hàng</p>
            <p className="value">{task?.customer}</p>
          </div>
        </div>
        <div className="task-info-desc">
          <p className="label">Mô tả</p>
          <p className="value">{task?.description}</p>
        </div>
      </div>

      {/* FILES */}
      <div className="task-files">
        <p className="label">File gốc từ khách hàng</p>
        {task?.files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="clickable-file">
              {file.type === "audio" ? "🎵" : "📄"} {file.name} ({file.size})
            </span>
            <div className="file-actions">
              {file.type === "audio" && (
                <button className="btn-play" onClick={() => handlePlayPause(index, file)}>
                  {playingIndex === index ? "⏸" : "▶"}
                </button>
              )}
              <button className="btn-download" onClick={() => handleDownload(file)}>
                Tải về
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDownloadToast && (
        <div className="saved-toast">⬇️ Download: {downloadFileName}</div>
      )}

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
              <button
                key={val}
                className={progress === val ? "active" : ""}
                onClick={() => toggleProgress(val)}
              >
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

          <div className="upload-box"
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              const validFiles = files.filter(f => f.size <= 500 * 1024 * 1024);
              if (validFiles.length < files.length) {
                setUploadError("⚠️ Một số file quá lớn, tối đa 500MB mỗi file");
              } else {
                setUploadError("");
              }
              setSelectedFiles([...selectedFiles, ...validFiles]);
            }}
          >
            <div className="upload-icon">⬆️</div>
            <p>Kéo thả file vào đây hoặc</p>
            <button
              type="button"
              className="select-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("fileInput").click();
              }}
            >
              Chọn file từ máy tính
            </button>
            <input
              type="file"
              id="fileInput"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <p className="small-text">Kích thước tối đa: 500MB mỗi file</p>
          </div>

          {/* Danh sách file đã chọn */}
          {selectedFiles.length > 0 && (
            <ul className="selected-file-list">
              {selectedFiles.map((file, i) => (
                <li key={i}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  <span
                    className="remove-file"
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))}
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          )}

          {uploadError && <div className="upload-error">{uploadError}</div>}

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

          <div className="upload-actions">
            <button onClick={() => setActiveTab("work")}>Hủy</button>
            <button onClick={handleSendUpload}>Gửi sản phẩm</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showSaved && <div className="saved-toast">✅ Đã lưu nháp</div>}
      {showNoChange && <div className="saved-toast warning">⚠️ Bản nháp đã có sẵn, không có thay đổi nào</div>}
      {showUploadSuccess && <div className="saved-toast success">✅ Upload thành công</div>}

      {/* Audio element */}
      {!USE_MOCK && <audio ref={audioRef} />}
    </div>
  );
};

export default TaskDetail;
