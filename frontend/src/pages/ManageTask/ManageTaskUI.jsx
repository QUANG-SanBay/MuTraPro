import React from "react";
import TaskTabs from "./task_Card/TaskTabs";
import TaskList from "./task_Card/TaskList";
import "./ManageTaskUI.scss";

export default function ManageTaskUI() {
  return (
    <div className="manage-task">
      <div className="container">
        <header className="manage-task__header">
          <h1>Giám sát tiến độ công việc</h1>
          <p>Theo dõi chi tiết tiến độ các nhiệm vụ đang thực hiện</p>
        </header>

        <TaskTabs />
        <TaskList />
      </div>
    </div>
  );
}
