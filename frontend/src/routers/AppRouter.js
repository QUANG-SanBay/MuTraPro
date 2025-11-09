import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRouter, customerRouter } from "./routes";
// Nếu alias "~" chưa hoạt động, đổi import này sang đường dẫn tương đối:
import DefaultLayout from "~/components/layouts/defaultLayout/DefaultLayout";

function AppRouter() {
  return (
    <Routes>
      {/* redirect root */}
      <Route path="/" element={<Navigate to="/customer/approval" replace />} />

      {/* public router */}
      {publicRouter.map((item, index) => (
        <Route key={`pub-${index}`} path={item.path} element={item.element} />
      ))}

      {/* customer router */}
      {customerRouter.map((item, index) =>
        item.layout === "default" ? (
          <Route
            key={`cus-${index}`}
            path={item.path}
            element={
              <DefaultLayout type="customer">{item.element}</DefaultLayout>
            }
          />
        ) : (
          <Route key={`cus-${index}`} path={item.path} element={item.element} />
        )
      )}

      {/* 404 */}
      <Route
        path="*"
        element={<div style={{ padding: 24 }}>404 — Not Found</div>}
      />
    </Routes>
  );
}

export default AppRouter;
