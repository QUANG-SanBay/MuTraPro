import { Routes, Route } from "react-router-dom";
import { publicRouter, customerRouter, specialistRouter } from "./routes";

import DefaultLayout from "~/components/layouts/defaultLayout/DefaultLayout";
import ProtectedRoute from "~/components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "~/pages/Unauthorized/Unauthorized";

import { OrderTracking } from "~/pages/customer/order";
import TaskDetail from "~/pages/specialist/transcription_Specialist/TaskDetail/TaskDetail";

function AppRouter() {
  return (
    <Routes>

      {/* PUBLIC ROUTER */}
      {publicRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}

      {/* UNAUTHORIZED */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* CUSTOMER ROUTER */}
      {customerRouter.map((item, index) => {
        const element = (
          <ProtectedRoute allowedRoles={["customer"]}>
            {item.layout === "default" ? (
              <DefaultLayout type="customer">{item.element}</DefaultLayout>
            ) : (
              item.element
            )}
          </ProtectedRoute>
        );

        return <Route key={index} path={item.path} element={element} />;
      })}

      {/* SPECIALIST ROUTER */}
      {specialistRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute allowedRoles={["customer", "specialist"]}>
              <DefaultLayout type="specialist">{item.element}</DefaultLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* CUSTOM ROUTES THÊM BÊN NGOÀI */}

      <Route
        path="/"
        element={
          <DefaultLayout type="customer">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600">
                Welcome to MuTraPro!
              </h1>
              <p className="text-gray-600 mt-2">
                Hệ thống đặt hàng dịch vụ thu âm & upload thông minh.
              </p>
            </div>
          </DefaultLayout>
        }
      />

      <Route
        path="/OrderTracking"
        element={
          <DefaultLayout type="customer">
            <OrderTracking />
          </DefaultLayout>
        }
      />

      <Route
        path="/TaskDetail"
        element={
          <DefaultLayout type="customer">
            <TaskDetail />
          </DefaultLayout>
        }
      />

    </Routes>
  );
}

export default AppRouter;
