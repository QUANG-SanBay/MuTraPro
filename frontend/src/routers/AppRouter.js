import { Routes, Route } from "react-router-dom";
import {publicRouter} from './routes';

function AppRouter(){
    return(
        <Routes>
            {/* public routerr */}
            {publicRouter.map((item, index)=>(
                <Route key={index} path={item.path} element={item.element}></Route>
            ))}
        </Routes>
    )
}
export default AppRouter;