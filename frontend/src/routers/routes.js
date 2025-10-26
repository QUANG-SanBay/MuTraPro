import { Login, Register } from "~/pages/auth"

const publicRouter = [
    {path: '/login', element: <Login/>},
    {path: '/register', element: <Register/>},
]
const customerRouter = [

]
const serviceCoordinatorRouter = [

]
export {publicRouter, customerRouter, serviceCoordinatorRouter}