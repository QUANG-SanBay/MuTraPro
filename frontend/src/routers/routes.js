import React from "react";
import { Auth } from "~/pages/auth";
import { CustomerHome, CustomerProfile } from "~/pages/customer";
import Services from "~/pages/customer/serivices/Services";
// import OrderPage from "~/pages/customer/order/OrderPage";
import { Order, OrderTracking } from "~/pages/customer/order";
import OrderPage from "~/pages/customer/order/OrderPage";
import Payment from "~/pages/customer/payment/Paymen";
import { TaskDetail } from "~/pages/specialist";
import { AdminProfile, RolePermissionManagement, ReportsStatistics } from "~/pages/admin";
import ProductApproval from "~/pages/customer/ProductApproval.jsx";

import RequestIntakePage from "~/pages/customer/order/RequestIntakePage";
import AssignmentPage from "../pages/customer/order/AssignmentPage";

import AdminHome from "~/pages/admin/home/AdminHome";
import UserManagement from "~/pages/admin/users/UserManagement";

export const publicRouter = [
    { path: '/auth', element: <Auth /> }
];

export const customerRouter = [
    { path: '/customer', element: <CustomerHome />, layout: 'default' },
    { path: '/customer/profile', element: <CustomerProfile />, layout: 'default' },
    { path: '/customer/services', element: <OrderPage />, layout: 'default' },
    { path: '/customer/orders', element: <Order />, layout: 'default' },
    { path: '/customer/orders/tracking', element: <OrderTracking />, layout: 'default' },
    { path: '/customer/approval', element: <ProductApproval />, layout: 'default' },
    { path: '/customer/payments', element: <Payment />, layout: 'default' }
];

export const adminRouter = [
    { path: '/admin', element: <AdminHome />, layout: 'admin' },
    { path: '/admin/users', element: <UserManagement />, layout: 'admin' },
    { path: '/admin/permissions', element: <RolePermissionManagement />, layout: 'admin' },
    { path: '/admin/reports', element: <ReportsStatistics />, layout: 'admin' },
    { path: '/admin/profile', element: <AdminProfile />, layout: 'admin' }
];

export const serviceCoordinatorRouter = [
    { path: '/coordinator/requests', element: <RequestIntakePage />, layout: 'default' },
    { path: '/coordinator/assignments', element: <AssignmentPage />, layout: 'default' },
    // Service coordinator routes will be added here
];

export const specialistRouter = [
    { path: '/specialist/tasks', element: <TaskDetail />, layout: 'default' }
];

export const studioAdminRouter = [
    // Studio admin routes will be added here
];
