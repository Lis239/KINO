import React, {createContext} from 'react';
import App from './App';
import ReactDOM from "react-dom/client";
import UserStore from "./store/UserStore";
import Film_Store from "./store/Film_Store";
import Zal_Srore from "./store/Zal_Srore";
import Users_Store from "./store/Users_Store";
import Smens_Store from "./store/Smens_Store";
import SmenaSotrStore from "./store/Smens_Sotr_Store";
import SeansStore from "./store/Seans_Store";
import Main_Store from "./store/Main_Store";
import Bron_Store from "./store/Bron_Store";
import Bilet_Store from "./store/Bilet_Store";
import Statistic_Store from "./store/Statistic_Store";

export const Context=createContext(null)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <Context.Provider value={{
                user:new UserStore(),
                film:new Film_Store(),
                zal:new Zal_Srore(),
                users:new Users_Store(),
                smena:new Smens_Store(),
                smenasotrs:new SmenaSotrStore(),
                seans:new SeansStore(),
                main:new Main_Store(),
                bron:new Bron_Store(),
                bilet:new Bilet_Store(),
                stat:new Statistic_Store(),
    }}>
            <App/>
    </Context.Provider>
);

