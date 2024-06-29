import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import {AdminRoutes, authRoutes, publicRoutes} from "../routes";
import { Main_R} from "../utils/consts";
import {Context} from "../index";


const AppRouter = () => {
    const {user}=useContext(Context)
    return (
    <Routes>
        {user.isAuth && authRoutes.map(({path, Component}) =>
            <Route key={path} path={path} element={<Component />} exact/>
        )}
        {user.isAuth && (user?.user?.rol==='admin'|user?.user?.rol==='prod') && AdminRoutes.map(({path, Component}) =>
            <Route key={path} path={path} element={<Component />} exact/>
        )}

        {publicRoutes.map(({path, Component}) =>
            <Route key={path} path={path} element={<Component />} exact/>
        )}


        <Route path='*' element={<Navigate  to={Main_R}/>} exact />
    </Routes>
    );
};

export default AppRouter;