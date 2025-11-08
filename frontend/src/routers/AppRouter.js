import { Routes, Route } from "react-router-dom";
import {publicRouter, customerRouter, paymentRouter} from './routes';
import DefaultLayout from "~/components/layouts/defaultLayout/DefaultLayout";

function AppRouter(){
    return(
        <Routes>
            {/* public routerr */}
            {publicRouter.map((item, index)=>(
                <Route key={index} path={item.path} element={item.element}></Route>
            ))}
            {/* customer router */}
            {customerRouter.map((item, index)=>{
                if(item.layout === 'default'){
                    return (
                        <Route key={index} path={item.path} element={
                            <DefaultLayout type="customer">
                                {item.element}
                            </DefaultLayout>
                        }></Route>
                    )
                }
                return (
                    <Route key={index} path={item.path} element={item.element}></Route>
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