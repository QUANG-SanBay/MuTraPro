import React from "react";
import { Routes, Route } from "react-router-dom";
import { publicRouter, customerRouter, specialistRouter, adminRouter } from './routes';
import DefaultLayout from "../components/layouts/defaultLayout/DefaultLayout";
import AdminLayout from "../components/layouts/adminLayout/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import NotFound from "../pages/NotFound/NotFound";

// Import các page từ order feature
// import OrderPage from "../pages/customer/order/OrderPage";
// import RequestIntakePage from "../pages/customer/order/RequestIntakePage";
import AssignmentPage from "../pages/customer/order/AssignmentPage";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      {publicRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}

      {/* Unauthorized route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Customer routes */}
      {customerRouter.map((item, index) => {
        const protectedElement = (
          <ProtectedRoute allowedRoles={['customer']}>
            {item.element}
          </ProtectedRoute>
        );

        if (item.layout === 'default') {
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <DefaultLayout type="customer">
                    {item.element}
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
          );
        }

        return <Route key={index} path={item.path} element={protectedElement} />;
      })}

      {/* Specialist routes */}
      {specialistRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute allowedRoles={['customer', 'specialist']}>
              <DefaultLayout type="specialist">
                {item.element}
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Admin routes */}
      {adminRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                {item.element}
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      ))}
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
