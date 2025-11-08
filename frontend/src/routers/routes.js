import { Auth } from "~/pages/auth"
import { CustomerHome } from "~/pages/customer"
import PaymentPage from "~/pages/payment/PaymentPage"
import PaymentOrders from "~/pages/payment/PaymentOrder/PaymentOrderUI"

const publicRouter = [
    {path: '/auth', element: <Auth/>}
]
const customerRouter = [
    {path: '/customer', element: <CustomerHome/>, layout: 'default'}
]
const paymentRouter = [
    {path: '/payments', element: <PaymentPage/>, layout: 'default'},
    {path: '/payment-orders', element: <PaymentOrders/>, layout: 'default'}
]
const serviceCoordinatorRouter = [

]
export {publicRouter, customerRouter,paymentRouter, serviceCoordinatorRouter}