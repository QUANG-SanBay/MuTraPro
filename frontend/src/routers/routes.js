import { Auth } from "~/pages/auth";
import CustomerHome from "~/pages/customer/home/CustomerHome";
import CustomerProfile from "~/pages/customer/profile/Profile";
import Services from "~/pages/customer/serivices/Services";
import OrderPage from "~/pages/customer/order/OrderPage";
import Payment from "~/pages/customer/payment/Paymen";

export const publicRouter = [
    { path: '/auth', element: <Auth /> }
];

export const customerRouter = [
    { path: '/customer', element: <CustomerHome />, layout: 'default' },
    { path: '/customer/profile', element: <CustomerProfile />, layout: 'default' },
    { path: '/customer/services', element: <Services />, layout: 'default' },
    { path: '/customer/orders', element: <OrderPage />, layout: 'default' },
    { path: '/customer/payments', element: <Payment />, layout: 'default' }
];

export const adminRouter = [];
export const serviceCoordinatorRouter = [];
export const specialistRouter = [];
export const studioAdminRouter = [];
