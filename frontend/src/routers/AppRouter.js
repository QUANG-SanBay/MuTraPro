import { Routes, Route } from "react-router-dom";
import { publicRouter, customerRouter, specialistRouter, adminRouter, serviceCoordinatorRouter } from "./routes";
import DefaultLayout from "../components/layouts/defaultLayout/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import NotFound from "../pages/NotFound/NotFound";

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

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* --- Order routes của bạn --- */}
      <Route path="/order" element={<DefaultLayout type="customer"><OrderPage /></DefaultLayout>} />
      <Route path="/requests" element={<DefaultLayout type="customer"><RequestIntakePage /></DefaultLayout>} />
      <Route path="/assignments" element={<DefaultLayout type="customer"><AssignmentPage /></DefaultLayout>} />
      {/* --- END --- */}

      {/* Customer routes */}
      {customerRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DefaultLayout type="customer">{item.element}</DefaultLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Các route mới từ main (specialist, admin, coordinator) */}
      {serviceCoordinatorRouter?.map((item, index) => (
        <Route key={index} path={item.path} element={<ProtectedRoute allowedRoles={['service_coordinator']}><DefaultLayout type="coordinator">{item.element}</DefaultLayout></ProtectedRoute>} />
      ))}
      {specialistRouter?.map((item, index) => (
        <Route key={index} path={item.path} element={<ProtectedRoute allowedRoles={['customer','specialist']}><DefaultLayout type="specialist">{item.element}</DefaultLayout></ProtectedRoute>} />
      ))}
      {adminRouter?.map((item, index) => (
        <Route key={index} path={item.path} element={<ProtectedRoute allowedRoles={['admin']}><DefaultLayout type="admin">{item.element}</DefaultLayout></ProtectedRoute>} />
      ))}

      {/* Home page của bạn */}
      <Route path="/" element={
        <DefaultLayout type="customer">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">Welcome to MuTraPro!</h1>
            <p className="text-gray-600 mt-2">Hệ thống đặt hàng dịch vụ thu âm & upload thông minh.</p>
          </div>
        </DefaultLayout>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
