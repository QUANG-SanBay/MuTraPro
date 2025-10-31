import { Auth } from "~/pages/auth"
import { CustomerHome } from "~/pages/customer"

const publicRouter = [
    {path: '/auth', element: <Auth/>}
]
const customerRouter = [
    {path: '/customer', element: <CustomerHome/>}
]
const serviceCoordinatorRouter = [

]
export {publicRouter, customerRouter, serviceCoordinatorRouter}