import React, {useContext, useState} from 'react';
import { Button, Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import CreateSmena from "./AdminPanel/CreateSmena";
import {delOneSmena} from "../http/smenaAPI";
import {Context} from "../index";

const SmenaItem = ({id,smen}) => {
    const {smenasotrs} = useContext(Context)
    const [CSmenaVisible, setCSmenaVisible] = useState(false)
    const removeInfo =async (number) => {
        if (number){
           await delOneSmena(number).finally(
               smenasotrs.setSmena([])
            )
        }
    }
    return (
        <Container breakpoint="sm" className="Container ContainerR">
            <Row className="mt-4 d-flex justify-content-center ">
                <Col className="mb-3"> <div>{smen.name}</div></Col>
                <Col className="mb-1"> <div>{smen.info}</div></Col>
                <Col className=""> <Button  onClick={() => {
                    setCSmenaVisible(true)
                }}> Изменить </Button></Col>
                <Col className=""> <Button  onClick={()=> {
                    removeInfo(id)

                }}> Удалить </Button></Col>
            </Row>
            <CreateSmena show={CSmenaVisible} loc={id} onHide={() => setCSmenaVisible(false) }/>


        </Container>
    );
};

export default SmenaItem;



