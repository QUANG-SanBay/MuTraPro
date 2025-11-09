import React from "react";
import { Auth } from "~/pages/auth"
import { CustomerHome } from "~/pages/customer"

//  THÊM: import trang phê duyệt sản phẩm
import ProductApproval from "~/pages/customer/ProductApproval.jsx";

const publicRouter = [
    {path: '/auth', element: <Auth/>},
];

const customerRouter = [
    {path: '/customer', element: <CustomerHome/>, layout: 'default'},
//  THÊM: route cho màn phê duyệt sản phẩm
  { path: "/customer/approval", element: <ProductApproval />, layout: "default" },
];

const serviceCoordinatorRouter = [];

export {publicRouter, customerRouter, serviceCoordinatorRouter}