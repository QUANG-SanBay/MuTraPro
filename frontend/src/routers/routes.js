import { Auth } from "~/pages/auth"
import { CustomerHome, CustomerProfile } from "~/pages/customer"

const publicRouter = [
    {path: '/auth', element: <Auth/>}
]
const customerRouter = [
    {path: '/customer', element: <CustomerHome/>, layout: 'default'},
    {path: '/customer/profile', element: <CustomerProfile/>, layout: 'default'}
]
const serviceCoordinatorRouter = [

]
export {publicRouter, customerRouter, serviceCoordinatorRouter}