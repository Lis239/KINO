import React from 'react';
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import {isEmpty, strtodata} from "./globfunc";


const BiletItem = ({bilet,max}) => {

    const date=new Intl.DateTimeFormat("ru",{dateStyle: "short", timeStyle: "short"}).format(new Date(bilet.date_create))
    function getrad(meto){

        const mesto={
            rad:0,
            mesto:0,
        }
        if (isEmpty(meto)){
            mesto.rad=Math.floor(meto/max)
            mesto.rad+=1
            mesto.mesto=meto%max
        }
        return mesto
    }

    const mesto= getrad(bilet?.mesto)
    return (
        <Container   style={{width:350}} breakpoint="sm" className="Container ContainerG">
            <Row className="mt-4 d-flex justify-content-center " >
                <Col >
                    <Row className="mb-1"> <div>Владелец: {bilet?.User?.FIO||bilet?.fio}</div></Row>
                    <Row className="mb-1"> <div>Название: {bilet?.sean?.film?.name||bilet["sean.film.name"]}</div></Row>
                    <Row className="mb-1"> <div>{bilet?.sean?.Zal?.name}</div></Row>
                    <Row className="mb-1"> <div>Общее: {bilet?.mesto}</div></Row>
                    <Row className="mb-1"> <div>Ряд: {mesto.rad}</div></Row>
                    <Row className="mb-1"> <div>Место: {mesto.mesto}</div></Row>
                    <Row className="mb-1"> <div>Способ получения: {bilet?.sposob}</div></Row>
                    <Row className="mb-1"> <div>Дата/время создания: {date}</div></Row>
                    <Row className="mb-1"> <div>Дата сеанса: {strtodata(bilet?.sean?.date||bilet["sean.date"])}</div></Row>
                    <Row className="mb-1"> <div>Время начала: {bilet?.time}</div></Row>
                </Col>

            </Row>
        </Container>
    );
};

export default BiletItem;