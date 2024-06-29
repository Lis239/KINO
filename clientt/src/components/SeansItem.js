import React, {useContext, useState} from 'react';
import { Button, Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import CreateSeans from "./AdminPanel/CreateSeans";
import 'react-toastify/dist/ReactToastify.css';
import {delOneSeans} from "../http/seansAPI";
import {Context} from "../index";

const SeansItem = ({seanss}) => {
    const {seans} = useContext(Context)
    const [select, setSelect] = useState(null)
    const [CSeansVisible, setCSeanVisible] = useState(false)
    const remove=async (number) => {
        if (number){
            await delOneSeans(number).finally(
                seans.setReload(!seans.getReload)
            )
        }
    }
    return (
        <Container breakpoint="sm" className="Container ContainerG">
            <Row className="mt-4 d-flex justify-content-center " >
                <Col className="mb-3"> {seanss?.date}</Col>
                <Col className="mb-1"> {seanss?.time_start}</Col>
                <Col className="mb-3"> {seanss?.time_end}</Col>
                <Col className="mb-3"> {seanss?.film.name}</Col>
                <Col className="mb-3"> {seanss?.Vis ? "Видим" : "Скрыт"}</Col>
                <Col className=""> <Button  onClick={() => {
                        setSelect(seanss?.id_seans)
                        setCSeanVisible(true)
                }}> Изменить </Button></Col>
                <Col className=""> <Button  onClick={()=> {
                    remove(seanss?.id_seans)
                }}> Удалить </Button></Col>
            </Row>
            <CreateSeans show={CSeansVisible} loc={select} onHide={() => setCSeanVisible(false) }/>
        </Container>

    );
};

export default SeansItem;




