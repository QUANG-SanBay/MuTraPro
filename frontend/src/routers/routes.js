import { Auth } from "~/pages/auth"
import { CustomerHome, CustomerProfile } from "~/pages/customer"

const publicRouter = [
    {path: '/auth', element: <Auth/>}
]

const customerRouter = [
    {path: '/customer', element: <CustomerHome/>, layout: 'default'},
    {path: '/customer/profile', element: <CustomerProfile/>, layout: 'default'}
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