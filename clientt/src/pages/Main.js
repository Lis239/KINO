import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Container} from "react-bootstrap";
import MainCollection from "../components/Main_Collections";
import {Context} from "../index";
import {fetchMain} from "../http/mainAPI";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";



const Main  = observer(() => {
    const {main} = useContext(Context)
    useEffect(() => {
        fetchMain(1, main.getLimit,null).then(data => {
            main.setMain(data.getMain.seans.rows)
            main.setTotalCount(data.getMain.count)
            if (data.getMain.count>0){
                main.setMainDate(data.getMain.seans?.rows[0]?.d_date)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Container className="d-flex justify-content-center "
                   style={{height: window.innerHeight - 54}}
            >
            <Row className="mt-2" >
                <Col md={12}>
                    <MainCollection/>
                </Col>
            </Row>
        </Container>
    );
});

export default Main;