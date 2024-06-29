import Admin from "./pages/Admin";
import {
    ADMIN_R,
    Bilets_R,
    Brons_R,
    Film_R,
    Login_R,
    Main_R,
    Registr_R, Seans_R,
    Smena_R,
    Smena_Sotr_R, Stat_R,
    USER_R,
    USERS_R,
    Zal_R
} from "./utils/consts";
import User from "./pages/User";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Film from "./pages/Film";
import Zal from "./pages/Zal";
import UsersStatus from "./pages/Users_Status";
import Smena from "./pages/Smena";
import SmenaSotrs from "./pages/Smena_Sotrs";
import Seans from "./pages/Seans";
import MainSeansSelect from "./pages/Main_Seans_Select";
import Brons from "./pages/Brons";
import Bilets from "./pages/Bilets";
import Statistic from "./pages/Statistic";


export const authRoutes=[

    {
        path:USER_R+ '/:id',
        Component:User
    },
    {
        path:Brons_R,
        Component:Brons
    },
    {
        path:Bilets_R,
        Component:Bilets
    }

]


export const AdminRoutes=[
    {
        path:Film_R,
        Component:Film
    },
    {
        path:ADMIN_R,
        Component:Admin
    },
    {
        path:USERS_R,
        Component:UsersStatus
    },
    {
        path:Smena_R,
        Component:Smena
    },
    {
        path:Smena_Sotr_R,
        Component:SmenaSotrs
    },
    {
        path:Seans_R,
        Component:Seans
    },
    {
        path:Stat_R,
        Component:Statistic
    }
]

export const publicRoutes=[
    {
        path: Main_R,
        Component:Main
    },
    {
        path:Registr_R,
        Component:Auth
    },
    {
        path:Login_R,
        Component:Auth
    },
    {
        path:Zal_R,
        Component:Zal
    },
    {
        path: Main_R+'/:id/:date',
        Component:MainSeansSelect
    },
]