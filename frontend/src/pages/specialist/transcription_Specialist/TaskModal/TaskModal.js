import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskModal.css";

function TaskModal({ taskId = "TASK001" }) {
    const navigate = useNavigate();

    const [useMock] = useState(true); // BẬT/TẮT MOCK
    const [data, setData] = useState(null);

    // ================= MOCK DATA ==================
    const mockData = {
        taskId: "TASK001",
        songName: "Mùa hè rực rỡ",
        customer: "Nguyễn Văn A",
        requestId: "REQ001",
        status: "Mới",
        priority: "Cao",
        deliveryDate: "23/10/2025",
        deadline: "26/10/2025",
        remaining: "2 ngày 5 giờ",
        description: "Thực hiện ký âm cho bài hát pop, cần hoàn thành trong 3 ngày",
        special: "Cần chú ý phần harmony và melody phức tạp ở đoạn bridge",
        files: [
            { name: "audio-demo.mp3", type: "audio", url: "" },
            { name: "reference.pdf", type: "pdf", url: "" }
        ]
    };

    // ============== FETCH REAL DATA ===============
    useEffect(() => {
        if (useMock) {
            setData(mockData);
            return;
        }

        fetch(`http://localhost:4004/media/task/${taskId}`)
            .then(res => res.json())
            .then(real => setData(real))
            .catch(() => setData(null));
    }, [taskId, useMock]);

    // ============== HANDLE DOWNLOAD ===============
    const handleDownload = async (file) => {
        if (useMock) {
            console.log("Mock mode → Chỉ giả lập, không tải:", file.name);
            return;
        }

        try {
            const res = await fetch("http://localhost:4004/media/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: data.taskId,
                    fileName: file.name
                })
            });

            const result = await res.json();

            if (result.url) {
                window.open(result.url, "_blank");
            }
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    if (!data) return <p className="loading">Đang tải dữ liệu...</p>;

    // ======================== UI =============================
    return (
        <div className="task-modal-overlay">
            <div className="task-modal">

                {/* HEADER */}
                <div className="modal-header">
                    <h2>Chi tiết nhiệm vụ</h2>
                </div>

                {/* GRID INFO */}
                <div className="grid-info">
                    <div><strong>Mã nhiệm vụ:</strong> {data.taskId}</div>
                    <div><strong>Tên bài hát:</strong> {data.songName}</div>
                    <div><strong>Khách hàng:</strong> {data.customer}</div>
                    <div><strong>Mã yêu cầu:</strong> {data.requestId}</div>
                    <div><strong>Trạng thái:</strong> {data.status}</div>
                    <div><strong>Độ ưu tiên:</strong> {data.priority}</div>
                    <div><strong>Ngày giao:</strong> {data.deliveryDate}</div>
                    <div><strong>Hạn chót:</strong> {data.deadline}</div>
                    <div><strong>Thời gian còn lại:</strong> {data.remaining}</div>
                </div>

                {/* DESCRIPTION */}
                <div className="desc-box">{data.description}</div>

                {/* SPECIAL */}
                <div className="special-box">{data.special}</div>

                {/* FILE LIST */}
                <div className="file-section">
                    {data.files.map((file, i) => (
                        <div key={i} className="file-item">
                            <div className="file-name">
                                {file.type === "audio" ? "🎵" : "📄"} {file.name}
                            </div>

                            <button
                                className={`btn-download ${useMock ? "mock" : ""}`}
                                onClick={() => handleDownload(file)}
                            >
                                ⬇ Tải xuống
                            </button>
                        </div>
                    ))}
                </div>

                {/* FOOTER BUTTONS */}
                <div className="modal-footer">
                    <button className="btn-outline">Đóng</button>

                    <button
                        className="btn-black"
                        onClick={() => navigate("/specialist/taskdetail")}
                    >
                        Bắt đầu làm việc
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskModal;
