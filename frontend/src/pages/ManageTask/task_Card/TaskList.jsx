import React from "react";
import { useTaskStore } from "~/api/manageTaskApi";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const { tasks, activeTab } = useTaskStore();

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeTab);

  return (
    <div className="task-list">
      {filteredTasks.length === 0 ? (
        <p className="task-list__empty">Không có công việc nào trong mục này</p>
      ) : (
        filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
}
