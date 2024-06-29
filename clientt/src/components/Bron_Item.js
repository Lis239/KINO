import React, {useContext, useState} from 'react';
import Container from "react-bootstrap/Container";
import {Button, Col, Row} from "react-bootstrap";
import {Context} from "../index";
import {isEmpty, strtodata} from "./globfunc";
import CreateOplata from "./AdminPanel/CreateOplata";

const BronItem = ({bronn,clickcanselandex}) => {
    const {user,bilet,bron} = useContext(Context)
    const max=bilet.get_maxcoll
    const [COplataVisible,setCOplataVisible]=useState(false)
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
    console.log(bron)
    const mesto= getrad(bronn?.mesto)
    return (
        <Container   style={{widthmax:550}} breakpoint="sm" className="Container ContainerG">
            <Row className="mt-4 d-flex justify-content-center " >
                <Col md={8}>
                    <Row className="mt-1"> <div>ID: {bronn?.id_bron}</div></Row>
                    <Row className="mb-1"> <div>Название: {bronn?.sean?.film?.name||bronn["sean.film.name"]}</div></Row>
                    <Row className="mb-1"> <div>{bronn?.sean?.Zal?.name}</div></Row>
                    <Row className="mb-1"> <div>Ряд: {mesto?.rad}</div> </Row>
                    <Row className="mb-1"> <div>Место: {mesto?.mesto}</div></Row>
                    <Row className="mb-1"> <div>Способ получения: {bronn?.sposob}</div></Row>
                    <Row className="mb-1"> <div>Статус: {bronn?.status}</div></Row>
                    <Row className="mb-1"> <div>Дата сеанса: {strtodata(bronn?.sean?.date||bronn["sean.date"])}</div></Row>
                    <Row className="mb-1"> <div>Время начала: {bronn?.time}</div></Row>
                    <Row className="mb-1"> <div>Время окончания: {bronn?.sean?.time_end||bronn["sean.time_end"]}</div></Row>
                    <Row className="mb-1"> <div>Цена: {bronn?.sum||bronn["sean.price"]}</div></Row>

                    {user?.user?.rol==="admin" ? <Row className="mb-1"> <div>Код: {bronn?.kod}</div></Row>:<div/> }
                </Col>
                <Col className="mt-1"> <Button  onClick={async () => {
                    await clickcanselandex(bronn?.id_bron,0,"")
                }}> Отменить </Button></Col>
                {
                    user?.user?.rol==="admin" ?
                        <Col className="mt-1"> <Button  onClick={async () => {
                            await clickcanselandex(bronn?.id_bron,1,bron.getKode)
                        }}> Подтвердить </Button></Col>
                        :
                        <Col className="mt-1"> <Button  onClick={async () => {
                            setCOplataVisible(true)
                        }}> Купить </Button></Col>
                }
            </Row>
            <CreateOplata  show={COplataVisible} loc='brontobilet' kode={bron.getKode} id={bronn?.id_bron} onHide={() => setCOplataVisible(false)}/>
        </Container>
    );
};

export default BronItem;