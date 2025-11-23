import React from "react";
import { Auth } from "~/pages/auth";
import { CustomerHome, CustomerProfile } from "~/pages/customer";
import Services from "~/pages/customer/serivices/Services";
import { Order, OrderTracking } from "~/pages/customer/order";
import OrderPage from "~/pages/customer/order/OrderPage";
import Payment from "~/pages/customer/payment/Paymen";
import PaymentPage from "~/pages/payment/PaymentPage";
import PaymentOrders from "~/pages/payment/PaymentOrder/PaymentOrderUI";
import { TaskDetail } from "~/pages/specialist";
import { AdminProfile, RolePermissionManagement, ReportsStatistics } from "~/pages/admin";
import ProductApproval from "~/pages/customer/ProductApproval.jsx";
import ManageTaskUI from "~/pages/ManageTask/ManageTaskUI";

import RequestIntakePage from "~/pages/customer/order/RequestIntakePage";
import AssignmentPage from "../pages/customer/order/AssignmentPage";

import AdminHome from "~/pages/admin/home/AdminHome";
import UserManagement from "~/pages/admin/users/UserManagement";
import SystemSettings from "~/pages/admin/settings/SystemSettings";

export const publicRouter = [
    { path: '/auth', element: <Auth /> }
];

export const customerRouter = [
    { path: '/customer', element: <CustomerHome />, layout: 'default' },// Quang -> Trung -> Hiếu -> Lý -> Thắng.
    { path: '/customer/profile', element: <CustomerProfile />, layout: 'default' },
    { path: '/customer/services', element: <OrderPage />, layout: 'default' },//  Trung 
    { path: '/customer/orders', element: <Order />, layout: 'default' },
    { path: '/customer/orders/tracking', element: <OrderTracking />, layout: 'default' },// Thắng
    { path: '/customer/approval', element: <ProductApproval />, layout: 'default' },// Công Lý
    { path: '/customer/payments', element: <PaymentOrders />, layout: 'default' },// Hiếu
    { path: '/payments', element: <PaymentPage />, layout: 'default' },// Hiếu 
];

export const adminRouter = [
    { path: '/admin', element: <AdminHome />, layout: 'admin' },
    { path: '/admin/users', element: <UserManagement />, layout: 'admin' },
    { path: '/admin/permissions', element: <RolePermissionManagement />, layout: 'admin' },
    { path: '/admin/settings', element: <SystemSettings />, layout: 'admin' },
    { path: '/admin/reports', element: <ReportsStatistics />, layout: 'admin' },
    { path: '/admin/profile', element: <AdminProfile />, layout: 'admin' },
    // { path: '/admin/manage-tasks', element: <ManageTaskUI />, layout: 'admin' }
];

export const serviceCoordinatorRouter = [
    { path: '/coordinator/requests', element: <RequestIntakePage />, layout: 'default' },// Trung
    { path: '/coordinator/assignments', element: <AssignmentPage />, layout: 'default' },// Trung
    { path: '/specialist/tasks', element: <TaskDetail />, layout: 'default' }// Thắng
];

export const specialistRouter = [
];

export const studioAdminRouter = [
    // Studio admin routes will be added here
];
