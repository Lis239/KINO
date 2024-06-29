import React, {useContext, useState} from 'react';
import {Image, Button, Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import CreateZal from "./AdminPanel/CreateZal";
import {toast, ToastContainer} from "react-toastify";
import {Context} from "../index";

const ZalItem = ({zal,Sel}) => {
    const [select, setSelect] = useState(null)
    const [CZalVisible, setCZalVisible] = useState(false)
    const {seans} = useContext(Context)
    const notify = (name,id) => toast.success("Выбран " +name+" C id="+id );
    return (
        <Container breakpoint="sm" className="Container ContainerR">
            <Row className="mt-4 d-flex justify-content-center ">
                <Col className="mb-3 sm"> <Image   thumbnail  src={process.env.REACT_APP_API_URL + zal.img}/></Col>
                <Col className="mb-3"> <div>{zal.name}</div></Col>
                <Col className="mb-1"> <div>{zal.mesta_count}</div></Col>
                {Sel?
                    <Col className="">
                        <div>
                            <Button  onClick={() => {
                                notify(zal.name,zal.id_zal)
                                seans.setZALID(zal)
                            }}> Выбрать </Button>
                            <ToastContainer />
                        </div>
                    </Col>
                    :
                    <Col className=""> <Button  onClick={() => {
                        setSelect(zal.id_zal)
                        setCZalVisible(true)
                    }}> Изменить </Button></Col>
                }
            </Row>
            <CreateZal show={CZalVisible} loc={select} onHide={() => setCZalVisible(false) }/>


        </Container>
    );
};

export default ZalItem;





