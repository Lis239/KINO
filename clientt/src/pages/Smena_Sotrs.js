import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../CSS/globla.css'
import {Button} from "react-bootstrap";
import СreateSmenaSotr from "../components/AdminPanel/СreateSmenaSotr";
import {fetchSmenaSotr} from "../http/smenasotrAPI";
import {Context} from "../index";
import SmenaSotrCollection from "../components/Smena_Sotr_Collection";

const SmenaSotrs = observer(() => {
    const {smenasotrs,user}=useContext(Context)
    const [calDate, setCalDate] = useState(new Date())
    const [ruDate, setruDate] = useState(new Intl.DateTimeFormat("ru", {dateStyle: "short"}).format(calDate))
    const [CSmenaSotrVisible, setCSmenaSotrVisible] = useState(false)
    function onChange (calDate) {
        setCalDate(calDate)
        setruDate(new Intl.DateTimeFormat("ru", {dateStyle: "short"}).format(calDate));
    }
    useEffect(() => {
        fetchSmenaSotr(calDate).then(data => {
            smenasotrs.setSmensotr(data.getSmensSotr)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [CSmenaSotrVisible,ruDate,calDate,smenasotrs.getReload])
    return (
        <Container className="d-flex flex-column mt-2 justify-content-center  align-items-center">
            <Card style={{minWidth:300, maxWidth:600}} className="p-5">
            <Row>
                <Col >
                    <Row><Button onClick={() => onChange(new Date())}>Сегодня</Button></Row>
                    <Row>
                    <Calendar onChange={onChange} value={calDate} />
                    </Row>
                    <Row className="justify-content-center">
                        <Form.Label className='Text_C'>
                            Выбрана Дата
                        </Form.Label>
                    <p className='Text_C'> {ruDate||"Дата не выбрана"}</p>
                    </Row>
                    {user?.user?.rol==="admin"?
                        <Row>
                            <Button
                                variant={"outline-dark"}
                                className="p-2"
                                onClick={() => setCSmenaSotrVisible(true)}
                            >
                                Добавить назначение
                            </Button>
                        </Row>
                        :<div>
                        </div>
                    }

                </Col>
            </Row>
                <Row className="mt-2">
                    <SmenaSotrCollection calDate={calDate}/>
                </Row>
            </Card>
            <СreateSmenaSotr show={CSmenaSotrVisible} date={calDate} onHide={() => setCSmenaSotrVisible(false)}/>
        </Container>
    );
});

export default SmenaSotrs;