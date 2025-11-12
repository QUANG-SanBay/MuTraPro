import React from "react";
import { Eye, Calendar, Clock } from "lucide-react";

export default function TaskCard({ task }) {
  const getTagColor = (tag) => {
    const map = {
      "Thu âm": "green",
      "Cao": "dark",
      "Phối khí": "purple",
      "Khẩn cấp": "red",
      "Chờ review": "yellow",
    };
    return map[tag] || "gray";
  };

  return (
    <div className="task-card">
      <div className="task-card__header">
        <div>
          <h3>{task.title}</h3>
          <div className="task-card__tags">
            {task.tags.map((tag, i) => (
              <span key={i} className={`tag tag--${getTagColor(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button className="task-card__detail">
          <Eye size={16} /> Chi tiết
        </button>
      </div>

      <div className="task-card__meta">
        <div className="avatar">{task.customerInitial}</div>
        <span>{task.customer}</span>
        <span className="meta-item">
          <Calendar size={14} /> {task.startDate}
        </span>
        <span className="meta-item">
          <Clock size={14} /> {task.deadline}
        </span>
      </div>

      <div className="progress">
        <div className="progress__header">
          <span>Tiến độ</span>
          <span>{task.progress}%</span>
        </div>
        <div className="progress__bar">
          <div
            className="progress__fill"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
