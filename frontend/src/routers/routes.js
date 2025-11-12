import { Auth } from "~/pages/auth"
import { CustomerHome, CustomerProfile } from "~/pages/customer"
import Services from "~/pages/customer/serivices/Services"
import Order from "~/pages/customer/order/Order"
import Payment from "~/pages/payment/PaymentPage"


import PaymentPage from "~/pages/payment/PaymentPage"
import PaymentOrders from "~/pages/payment/PaymentOrder/PaymentOrderUI"
import ManageTaskUI from "~/pages/ManageTask/ManageTaskUI"

const publicRouter = [
    { path: '/auth', element: <Auth/> }
]

const customerRouter = [
    { path: '/customer', element: <CustomerHome/>, layout: 'default' },
    { path: '/customer/profile', element: <CustomerProfile/>, layout: 'default' },
    { path: '/customer/services', element: <Services/>, layout: 'default' },
    { path: '/customer/orders', element: <Order/>, layout: 'default' },
    { path: '/customer/payments', element: <PaymentPage/>, layout: 'default' }
]

const paymentRouter = [
    { path: '/payments', element: <PaymentPage/>, layout: 'default' },
    { path: '/payments/payment-orders', element: <PaymentOrders/>, layout: 'default' },
    { path: '/admin/manage-tasks', element: <ManageTaskUI/>, layout: 'default' },
]
 
const adminRouter = [
    // Admin routes will be added here
    // Example: { path: '/admin/users', element: <AdminUsers/>, layout: 'admin' }
    { path: '/admin/manage-tasks', element: <ManageTaskUI/>, layout: 'default' },
]

const serviceCoordinatorRouter = [
    // Service coordinator routes will be added here
]

const specialistRouter = [
    // Specialist routes will be added here
]

const studioAdminRouter = [
    
]

export {
    publicRouter, 
    customerRouter, 
    paymentRouter,
    adminRouter,
    serviceCoordinatorRouter,
    specialistRouter,
    studioAdminRouter
}
