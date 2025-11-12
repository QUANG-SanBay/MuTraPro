import { Routes, Route } from "react-router-dom";
import {publicRouter, customerRouter, paymentRouter} from './routes';
import DefaultLayout from "~/components/layouts/defaultLayout/DefaultLayout";
import ProtectedRoute from "~/components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "~/pages/Unauthorized/Unauthorized";

function AppRouter(){
    return(
        <Routes>
            {/* public router */}
            {publicRouter.map((item, index)=>(
                <Route key={index} path={item.path} element={item.element}></Route>
            ))}
            
            {/* Unauthorized route */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* customer router - Protected with customer role */}
            {customerRouter.map((item, index)=>{
                const protectedElement = (
                    <ProtectedRoute allowedRoles={['customer']}>
                        {item.element}
                    </ProtectedRoute>
                );
                
                if(item.layout === 'default'){
                    return (
                        <Route key={index} path={item.path} element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <DefaultLayout type="customer">
                                    {item.element}
                                </DefaultLayout>
                            </ProtectedRoute>
                        }></Route>
                    )
                }
                return (
                    <Route key={index} path={item.path} element={protectedElement}></Route>
                )
            })}
            {paymentRouter.map((item, index)=>{
                if(item.layout === 'default'){
                    return (
                        <Route key={index} path={item.path} element={
                            <DefaultLayout type="payment">
                                {item.element}
                            </DefaultLayout>
                        }></Route>
                    )
                }
                return (
                    <Route key={index} path={item.path} element={item.element}></Route>
                )
            })}
        </Routes>
    )
}
export default AppRouter;