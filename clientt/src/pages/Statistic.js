import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import {Col, Row,Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import {fetchStat} from "../http/statAPI";
import {Context} from "../index";
import Table from 'react-bootstrap/Table';

const Statistic =  observer(() => {
    const {stat} = useContext(Context)
    const [calDateS, setCalDateS] = useState(new Date(new Date().setHours(3,0,0)))
    const [calDateE, setCalDateE] = useState(new Date(new Date().setHours(3,0,0)))
    function onChangeS (calDateS) {
        setCalDateS(calDateS)
    }
    function onChangeE (calDateE) {
        setCalDateE(calDateE)
    }
    function click (){
        fetchStat(calDateS,calDateE).then(data => {
            stat.setStat(data.getStat)
            console.log(data.getStat)
        })
    }
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <Row>
                <Col>
                    <Row>

                        <Col>
                            Дата Начала
                        </Col>
                        <DatePicker
                            className="mt-2 DatPic_H"
                            selected={ calDateS }
                            onChange={onChangeS}
                            name="startDate"
                            dateFormat="dd.MM.yyyy"
                            locale={ru}
                        />
                    </Row>

                </Col>

                <Col>
                    <Row>
                        <Col>
                            Дата Окончания
                        </Col>
                        <DatePicker
                            className="mt-2 DatPic_H"
                            selected={ calDateE }
                            onChange={onChangeE}
                            name="startDate"
                            dateFormat="dd.MM.yyyy"
                            locale={ru}
                        />
                    </Row>
                </Col>

                <Col className="d-flex flex-column justify-content-center ">
                    <Row  className="mt-2">

                        <Button

                            onClick={click}
                        > Отобразить </Button>

                    </Row>
                </Col>
            </Row>


                <Table className="mt-2" striped bordered hover>
                    <tbody>
                    <tr>
                        <td>   Количество Действующего бронирования</td>
                        <td>    {stat.getStat?.colbronD??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>   Количество Купленного бронирования</td>
                        <td>    {stat.getStat?.colbronP??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>   Количество Купленных билетов всего</td>
                        <td>    {stat.getStat?.colbilall??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>   Количество Купленных билетов на сайте</td>
                        <td>    {stat.getStat?.colbilsite??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>   Количество Купленных билетов на кассе</td>
                        <td>    {stat.getStat?.colbilkass??"пусто"}</td>
                    </tr>


                    <tr>
                        <td>   Общяя сумма приобритенных билетов всего</td>
                        <td>    {stat.getStat?.sumbilall??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>   Общяя сумма приобритенных билетов на сайте</td>
                        <td>    {stat.getStat?.sumbilsite??"пусто"}</td>
                    </tr>
                    <tr>
                        <td>    Общяя сумма приобритенных билетов на кассе</td>
                        <td>    {stat.getStat?.sumbilkass??"пусто"}</td>
                    </tr>
                    <tr>
                        <td  style={{textAlign: "center", verticalAlign: "middle"}} colSpan={2} >    Топ 3 места по сборам</td>
                    </tr>
                    {
                        stat.getStat?.filmsum?.map(itm =>
                                <tr key={'tr'+itm["sean.film.name"].toString()+""}>
                                    <td key="td1_">    {itm["sean.film.name"]}</td>
                                    <td key="td2_">    {itm.sum??"пусто"}</td>
                                </tr>
                        )}
                    </tbody>

                </Table>


        </Container>
    );
});

export default Statistic;