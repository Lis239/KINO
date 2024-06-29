import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom";
import {ADMIN_R, Bilets_R, Brons_R, Login_R, Main_R, Smena_Sotr_R, Stat_R, USER_R} from "../utils/consts";
import "../CSS/local.css"
import {Button, Container} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import "react-bootstrap/dist/react-bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate,useLocation } from 'react-router-dom'
import "../CSS/local.css"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useWindowDimensions from "../myHooks/useWindowDimensions";


const NavBar = observer(() => {
    const {user}=useContext(Context)
    const history = useNavigate()
    const loc=useLocation()
    const { width } = useWindowDimensions();
    const logOut = () => {
        user.setuser({})
        user.setisAuth(false)
        history(Main_R)
        localStorage.removeItem('token')
    }
    useEffect(() => {
        console.log(loc)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onReload = () => {
        history("../"+USER_R+"/"+user.user.id,
            {
                replace: true
            }
         )}

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container style={{ display: "d-flex",alignItems: "center"}} >
                <NavLink  className="C_Wh"  to={Main_R}>KINO</NavLink>
                {
                    width>1000?
                        user.isAuth ?
                                user?.user?.rol==='admin'||user?.user?.rol==='prod' ?

                                    <Nav className="ml-auto">
                                        <Nav.Item>
                                            <Button className="Text_Wh"
                                                    variant={"outline-secondary"}
                                                    onClick={() =>  user?.user?.rol==='admin'? history(ADMIN_R): history(Smena_Sotr_R)}
                                            >
                                                {user?.user?.rol==='admin'? "Панель администрирования" : "Назначения на смены"}
                                            </Button>
                                        </Nav.Item>
                                        {user?.user?.rol === 'admin' ?

                                            <Nav.Item className="ms-2 Text_Wh">
                                                <Button className="Text_Wh"
                                                        variant={"outline-secondary"}
                                                        onClick={() => history(Stat_R)}
                                                >
                                                    Статистика
                                                </Button>
                                            </Nav.Item>
                                            :
                                            <div></div>
                                        }
                                        <DropdownButton id="dropdown-basic-button"
                                                        title="Профиль"
                                                        className="ms-2 Text_Wh"
                                                        variant={"outline-secondary"}
                                        >
                                            <Dropdown.Item onClick={onReload}>Мой профиль</Dropdown.Item>
                                            <Dropdown.Item onClick={()=> history("../"+Brons_R, {replace: true})}>Бронь</Dropdown.Item>
                                            <Dropdown.Item onClick={()=> history("../"+Bilets_R, {replace: true})}>Билеты</Dropdown.Item>
                                        </DropdownButton>
                                        <Nav.Item>
                                            <Button className="ms-2 Text_Wh "
                                                    variant={"outline-secondary"}
                                                    onClick={() => logOut()}
                                            >
                                                Выход</Button>
                                        </Nav.Item>
                                    </Nav>

                                    :
                                    <Nav className="ml-auto">
                                        <DropdownButton id="dropdown-basic-button"
                                                        title="Профиль"
                                                        className="ms-2 Text_Wh"
                                                        variant={"outline-secondary"}>
                                            <Dropdown.Item onClick={onReload}>Мой профиль</Dropdown.Item>
                                            <Dropdown.Item onClick={()=> history("../"+Brons_R, {replace: true})}>Бронь</Dropdown.Item>
                                            <Dropdown.Item onClick={()=> history("../"+Bilets_R, {replace: true})}>Билеты</Dropdown.Item>
                                        </DropdownButton>
                                        <Nav.Item>
                                            <Button
                                                className="ms-2 Text_Wh"
                                                variant={"outline-secondary" }
                                                onClick={() => logOut()}
                                            >
                                                Выход</Button>
                                        </Nav.Item>
                                    </Nav>

                                :
                                <Nav className="ml-auto">
                                    <Button variant={"outline-secondary"} onClick={() => history(Login_R)}>Авторизация</Button>
                                </Nav>

                        :
                        user.isAuth ?
                            user?.user?.rol==='admin'||user?.user?.rol==='prod' ?
                                <Nav className="ml-auto">
                                    <DropdownButton id="dropdown-basic-button"
                                                    title="Меню"
                                                    className="ms-2 Text_Wh"
                                                    variant={"outline-secondary"}>
                                        <Dropdown.Menu id="dropdown-basic-button"
                                                       title="Профиль"
                                                       className="ms-2 Text_Wh"
                                                       variant={"outline-secondary"}>
                                        <Dropdown.Item onClick={onReload}>Мой профиль</Dropdown.Item>
                                        <Dropdown.Item onClick={() =>  history(Stat_R)}>Статистика</Dropdown.Item>
                                        <Dropdown.Item onClick={()=> history("../"+Brons_R, {replace: true})}>Бронь</Dropdown.Item>
                                        <Dropdown.Item onClick={()=> history("../"+Bilets_R, {replace: true})}>Билеты</Dropdown.Item>
                                        </Dropdown.Menu>

                                        <Dropdown.Item  onClick={() =>  user?.user?.rol==='admin'? history(ADMIN_R): history(Smena_Sotr_R)}> {user?.user?.rol==='admin'? "Панель администрирования" : "Назначения на смены"}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => logOut()}>Выход</Dropdown.Item>
                                    </DropdownButton>
                                </Nav>

                                :
                                <Nav className="ml-auto">
                                    <DropdownButton id="dropdown-basic-button"
                                                    title="Меню"
                                                    className="ms-2 Text_Wh"
                                                    variant={"outline-secondary"}>
                                        <Dropdown.Item onClick={onReload}>Мой профиль</Dropdown.Item>
                                        <Dropdown.Item onClick={()=> history("../"+Brons_R, {replace: true})}>Бронь</Dropdown.Item>
                                        <Dropdown.Item onClick={()=> history("../"+Bilets_R, {replace: true})}>Билеты</Dropdown.Item>
                                        <Dropdown.Item onClick={() => logOut()}>Выход</Dropdown.Item>
                                    </DropdownButton>
                                </Nav>


                                : <Nav className="ml-auto">
                                    <Button variant={"outline-secondary"} onClick={() => history(Login_R)}>Авторизация</Button>
                                </Nav>




                }


                </Container>
        </Navbar>
    );
});

export default NavBar;