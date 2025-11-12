import { Routes, Route } from "react-router-dom";
import { publicRouter, customerRouter } from "./routes";
import DefaultLayout from "../components/layouts/defaultLayout/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// import các page từ App.js cũ
import OrderPage from "../pages/customer/order/OrderPage";
import RequestIntakePage from "../pages/customer/order/RequestIntakePage";
import AssignmentPage from "../pages/customer/order/AssignmentPage";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      {publicRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Customer routes */}
      {customerRouter.map((item, index) => {
        const protectedElement = (
          <ProtectedRoute allowedRoles={["customer"]}>{item.element}</ProtectedRoute>
        );

        if (item.layout === "default") {
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <DefaultLayout type="customer">{item.element}</DefaultLayout>
                </ProtectedRoute>
              }
            />
          );
        }

        return <Route key={index} path={item.path} element={protectedElement} />;
      })}

      {/* Các route từ App.js cũ */}
      <Route
        path="/"
        element={
          <DefaultLayout type="customer">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600">Welcome to MuTraPro!</h1>
              <p className="text-gray-600 mt-2">
                Hệ thống đặt hàng dịch vụ thu âm & upload thông minh.
              </p>
            </div>
          </DefaultLayout>
        }
      />
      <Route
        path="/order"
        element={
          <DefaultLayout type="customer">
            <OrderPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/requests"
        element={
          <DefaultLayout type="customer">
            <RequestIntakePage />
          </DefaultLayout>
        }
      />
      <Route
        path="/assignments"
        element={
          <DefaultLayout type="customer">
            <AssignmentPage />
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default AppRouter;
