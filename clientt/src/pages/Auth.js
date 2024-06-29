import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Login_R, Main_R, Registr_R} from "../utils/consts";

import {Card, Container, Row, Button, Form, Spinner} from "react-bootstrap";
import {NavLink,useLocation,useNavigate} from "react-router-dom";
import {registration, logIn} from "../http/userAPI";




const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history  = useNavigate()
    const isLogin = location.pathname === Login_R
    const [login, setLogin] = useState('')
    const [pass, setPassword] = useState('')
    const [lname, setLname] = useState('')
    const [fname, setFname] = useState('')
    const [mname, setMname] = useState('')
    const [email, setEmail] = useState('')

    const [loading,setLoading]=useState(true)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)

    const checkautorise = async () => {
        const Login = location.pathname === Login_R
        const Reg = location.pathname === Registr_R
        if((Login||Reg)&&user.isAuth){
            history(Main_R,{ relative: "path",resplace:true })
        }
    }
    useEffect(() => {
            checkautorise().then().finally(() => setLoading(false))

    }, )

    useEffect(() => {
        setVIS(false)
    },  [location.pathname] )

    if (loading) {
        return <Spinner className="d-flex Spin_W_CENT"
                        animation={"grow"} />
    }
    const  click= async () => {
        try {
            let data;
            if (isLogin) {
                data = await logIn(login, pass);
            } else {
                data = await registration(login,pass,lname,fname,mname,email);
            }

            if (data.isCode===200){
                user.setuser(data.getUser)
                user.setisAuth(true)
                setVIS(false)
                history(Main_R)
                history(0)
            }
            if(data.isCode===400) {
                data.getUser.map( i => setMSG(i.msg))
            }else {
                setMSG(data.getmsg)
            }
            setVIS(true)
        } catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
        }
    }
        return (
        <Container className="d-flex justify-content-center align-items-center"
                   style={{height: window.innerHeight - 54}}>
            <Card style={{width: 600,minWidth:300}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                { VISib ?
                    <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                                 onClick={()=> setVIS(false)}>X</Button></div>

                    : <div className="m-auto" style={{color:"white"}}>

                    </div>
                }

                <Form className="d-flex flex-column">
                    {!isLogin ?

                        <>
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ваш login..."
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ваш пароль..."
                            value={pass}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите вашу фамилию..."
                        value={lname}
                        onChange={e => setLname(e.target.value)}
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите ваше имя..."
                        value={fname}
                        onChange={e => setFname(e.target.value)}

                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите вашe отчество..."
                        value={mname}
                        onChange={e => setMname(e.target.value)}
                        />
                        <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}

                        />
                        </>
                    :
                        <>
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш login..."
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={pass}
                        onChange={e => setPassword(e.target.value)}
                        type="password"

                    /></>
                    }
                    <Row className="d-flex justify-content-between mt-3 pe-2" >
                        {isLogin ?
                            <div className="col">
                                Нет аккаунта? <br/><NavLink to={Registr_R}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div className="col">
                                Есть аккаунт?<br/> <NavLink to={Login_R}>Войдите!</NavLink>
                            </div>
                        }
                        <Button className="col-3 p-1" style={{ whiteSpace: "nowrap",textAlign:"center", minWidth:isLogin? 80:120 }}
                            variant={"outline-success"}
                                onClick={()=>click()}

                        >

                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;