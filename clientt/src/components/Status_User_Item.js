import React, {useContext} from 'react';
import { Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../CSS/globla.css"
import {Context} from "../index";

const StatusUserItem = ({user}) => {
    const {users} = useContext(Context)

    return (
        <Container style={{minWidth:390}}  breakpoint="sm" className="Container" onClick={() => {
            users.setSelID(user.user_id)
        }}>
            <Row className="mt-3 d-flex justify-content-center " align="center">
                <Col className="mb-1"> <div>{user?.login}</div></Col>
                <Col className="mb-1"> <div>{user?.LName}</div></Col>
                <Col className="mb-1"> <div>{user?.FName}</div></Col>
                <Col className="mb-1"> <div>{user?.MName}</div></Col>
                <Col className="mb-1"> <div>{user?.rol}</div></Col>
            </Row>
        </Container>

    );
};

export default StatusUserItem;

