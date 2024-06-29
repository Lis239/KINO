import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import CreateFilm from "../components/AdminPanel/CreateFilm";
import Button from "react-bootstrap/Button";
import {Row} from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import {useNavigate} from "react-router-dom";
import {Film_R, USERS_R, Zal_R, Smena_R, Smena_Sotr_R, Seans_R} from "../utils/consts";
import CreateZal from "../components/AdminPanel/CreateZal";



const Admin= observer(() => {
    const history  = useNavigate()
    const [CFilmVisible, setCFilmVisible] = useState(false)
    const [CZalVisible, setCZalVisible] = useState(false)
    return (
        <Container className="d-flex flex-column">
            <Button
                variant={"outline-dark"}
                className="mt-4 p-2"
                onClick={() => history(USERS_R)}
            >
                Панель пользователей
            </Button>
            <Row>
                <Col className="d-flex flex-column">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => setCFilmVisible(true)}
                >
                Добавить фильм
                </Button>
                </Col>
            <Col className="d-flex flex-column">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => history(Film_R)}
                >
                    Список  фильмов (Редактирование)
                </Button>
            </Col>
            </Row>
             <Row>
                <Col className="d-flex flex-column">
                    <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => setCZalVisible(true)}
                    >
                    Добавить зал
                    </Button>
                </Col>
                <Col className="d-flex flex-column">
                    <Button
                        variant={"outline-dark"}
                        className="mt-4 p-2"
                        onClick={() => history(Zal_R)}
                    >
                    Список  залов (Редактирование)
                    </Button>
                </Col>
            </Row>
            <Button
                variant={"outline-dark"}
                className="mt-4 p-2"
                onClick={() => history(Seans_R)}
            >
                Cеансы
            </Button>

            <Row>
                <Col className="d-flex flex-column">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => history(Smena_R)}
                >
                    Cмены
                </Button>
                    </Col>
                        <Col className="d-flex flex-column">
                <Button
                variant={"outline-dark"}
                className="mt-4 p-2"
                onClick={() => history(Smena_Sotr_R)}
            >
                Назначения на смены
            </Button>
            </Col>
         </Row>
            <CreateFilm show={CFilmVisible} loc='create' onHide={() => setCFilmVisible(false)}/>
            <CreateZal show={CZalVisible} loc='create' onHide={() => setCZalVisible(false)}/>
        </Container>
    );
});

export default Admin;
