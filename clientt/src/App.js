import React, { useContext, useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {BrowserRouter} from "react-router-dom";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import { Spinner} from "react-bootstrap";
import {check} from "./http/userAPI";
import "./CSS/local.css"
const App = observer(()=> {
    const {user}=useContext(Context)
    const [loading,setLoading]=useState(true)
    useEffect(() => {
        setTimeout(()=> {
            check().then(data => {
                if(data.isCode===200){
                    user.setuser(data.getUser)
                    user.setisAuth(true)
                }
            }).catch(err=>{
                user.setuser(null)
                user.setisAuth(false)
            }).finally(() => setLoading(false))
        },1000)
    }, [user.getUser])

    if (loading) {
        return <Spinner className="d-flex Spin_W_CENT"
                        animation={"grow"}/>
    }

    return (
      <BrowserRouter>
          <NavBar />
          <AppRouter />
      </BrowserRouter>
  );
});
export default App;
