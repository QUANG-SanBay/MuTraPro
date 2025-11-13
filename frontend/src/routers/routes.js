import { Auth } from "~/pages/auth"
import { CustomerHome, CustomerProfile } from "~/pages/customer"
import Services from "~/pages/customer/serivices/Services"
import { Order } from "~/pages/customer/order"
import OrderTracking from "~/pages/customer/order/OrderTracking/OrderTracking"
import Payment from "~/pages/customer/payment/Paymen"
import TaskDetail from "~/pages/specialist/transcription_Specialist/TaskDetail/TaskDetail"

const publicRouter = [
    {path: '/auth', element: <Auth/>},
    {path: '/OrderTracking', element: <OrderTracking/>,},
    {path: '/TaskDetail', element: <TaskDetail/>,}
]

const customerRouter = [
    {path: '/customer', element: <CustomerHome/>, layout: 'default'},
    {path: '/customer/profile', element: <CustomerProfile/>, layout: 'default'},
    {path: '/customer/services', element: <Services/>, layout: 'default'},
    {path: '/customer/orders', element: <Order/>, layout: 'default'},
    {path: '/customer/orders/tracking', element: <OrderTracking/>, layout: 'default'},
    {path: '/customer/payments', element: <Payment/>, layout: 'default'},
]

const adminRouter = [
    // Admin routes will be added here
    // Example: {path: '/admin/users', element: <AdminUsers/>, layout: 'admin'}
]

const serviceCoordinatorRouter = [
    // Service coordinator routes will be added here
]

const specialistRouter = [
    // Specialist routes will be added here
    {path: '/specialist/taskdetail', element: <TaskDetail/>, layout: 'default'}
]

const studioAdminRouter = [
    // Studio admin routes will be added here
]

export {
    publicRouter, 
    customerRouter, 
    adminRouter,
    serviceCoordinatorRouter,
    specialistRouter,
    studioAdminRouter
}