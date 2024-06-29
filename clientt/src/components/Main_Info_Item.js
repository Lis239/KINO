import React, {useContext} from 'react';
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import "../CSS/globla.css"
import Button from "react-bootstrap/Button";
import {Context} from "../index";
import {MySeansMesta, SeansMesta} from "../http/blietAPI";
import {strtodata} from "./globfunc";

const MainInfoItem = ({seanss}) => {
    const {main} = useContext(Context)
    const {bilet} = useContext(Context)
    async function mest(id){
        try {
            let SM = await SeansMesta(id)
            if (SM.isCode === 200) {
                bilet.setMesta(SM.getMesta)
            }

        } catch (e) {
            console.log(e.response.data.message)
        }
        try {
            let SM = await MySeansMesta(id)
            if (SM.isCode === 200) {
                bilet.setMestaBuy(SM.getmestabuy)
                bilet.setMestaBron(SM.getmestabron)
            }

        } catch (e) {
            console.log(e.response.data.message)
        }

    }
    return (
   seanss.Vis?
    <Container className="Container ContainerG">
            <Row >
                <Col className="ms-1"> <Row>Дата сеанса</Row><Row>{strtodata(seanss.date)}</Row></Col>
                <Col className="ms-1"> <Row>Время начала</Row><Row>{seanss.time_start}</Row></Col>
                <Col className="ms-1"><Row>Продолжительность</Row><Row>{seanss.duration}</Row></Col>
                <Col className="ms-1"><Row>Время окончания</Row><Row>{seanss.time_end}</Row></Col>
                <Col className="ms-1"> <Row>Цена</Row><Row>{seanss.price}</Row></Col>
                <Col className="ms-1"><Button
                onClick={()=>{
                    main.setSelectOSeans(seanss)
                    bilet.setMesto(null)
                    bilet.setRad(null)
                    bilet.setRadmesto(null)
                    mest(seanss.id_seans)
                }}
                >
                    Выбрать
                </Button></Col>
             </Row>
    </Container>
    :
       <></>
    );
};

export default MainInfoItem;