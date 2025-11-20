import React from "react";
import { useTaskStore } from "~/api/manageTaskApi";

export default function TaskTabs() {
  const { tabs, activeTab, setActiveTab, tasks } = useTaskStore();

  const getCount = (id) => {
    if (id === "all") return tasks.length;
    return tasks.filter((t) => t.status === id).length;
  };

  return (
    <div className="task-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`task-tabs__item ${activeTab === tab.id ? "active" : ""}`}
        >
          {tab.label} ({getCount(tab.id)})
        </button>
      ))}
    </div>
  );
}
