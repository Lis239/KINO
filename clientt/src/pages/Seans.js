import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Context} from "../index";
import useDebounce from "../components/useDebounce";
import CreateSeans from "../components/AdminPanel/CreateSeans";
import PagesSeans from "../components/Pages_Seans";
import ru from "date-fns/locale/ru";
import DatePicker from "react-datepicker";
import SeansCollection from "../components/Seans_Collection";
import {fetchSeans} from "../http/seansAPI";


const Seans = observer(() => {
    const {seans} = useContext(Context)
    const debouncedSearchTerm = useDebounce(seans.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);
    const [CSeansVisible,setCSeansVisible]=useState(false)
    const [calDate, setCalDate] = useState(new Date(new Date().setHours(3,0,0)))
    const [isSearchDate,setSearchDate]=useState(false)

    function fetchSeansS(isSearchDate,debouncedSearchTerm){
        if (!isSearchDate){
            fetchSeans(null ,seans.getPage, seans.getLimit,debouncedSearchTerm).then(data => {
                Searchfunc(data, seans)
            }).finally(() =>  setIsSearching(false));
        }
        if (isSearchDate){
            fetchSeans(calDate ,seans.getPage, seans.getLimit,debouncedSearchTerm).then(data => {
                Searchfunc(data, seans)
            }).finally(() =>  setIsSearching(false));
        }
    }

    useEffect(() => {
        if (!isSearchDate){
            fetchSeans(null ,1, seans.getLimit,debouncedSearchTerm).then(data => {
                seans.setTotalCount(data.getSeans?.count)
            })
        }
        if (isSearchDate){
            fetchSeans(calDate ,1, seans.getLimit,debouncedSearchTerm).then(data => {
                seans.setTotalCount(data.getSeans?.count)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function Searchfunc(data,seans){
        if (data.getSeans?.rows){
            seans.setSeans(data.getSeans.rows)
            setisNull(false)
        }
        if (data.getSeans?.count) {
            seans.setTotalCount(data.getSeans.count)
        }
        if (!data.getSeans?.rows || !data.getSeans?.count){
            seans.setSeans([])
            seans.setTotalCount(0)
            setisNull(true)
        }
    }
    function onChange (calDate) {
        setCalDate(calDate)
    }
    useEffect(() => {
                setIsSearching(true);
                setTimeout(()=> {
                    fetchSeansS(isSearchDate,debouncedSearchTerm)
                },1000)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm,seans.getPage,isSearchDate,calDate,seans.getReload]);

    function onChangeSearchDate (e) {
        setSearchDate(e.target.checked)
    }
    return (
        <Container className="d-flex flex-column">
            <Row  className="mt-2 ">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 mb-4  p-2"
                    onClick={() => setCSeansVisible(true)}
                >
                    Добавить сеанс
                </Button>
                <Col>
                    <Row>
                    <DatePicker
                        className="mt-1 DatPic_H"
                        selected={ calDate }
                        onChange={ onChange }
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        locale={ru}
                    />
                    </Row>
                <Row>
                    <label>
                       { isSearchDate ? "Включить поиск по дате (Да)  " : "Включить поиск по дате (Нет) "}
                    <input type="checkbox"
                           onChange={onChangeSearchDate}
                    />
                    </label>
                </Row>
                </Col>
                <Col>
                    <input className="form-control d-flex flex-column"
                       type="text"
                       placeholder="Поиск по названию"
                       value={seans.getSearchT}
                       onChange={e => seans.setSearchT(e.target.value)}
                    />

                </Col>
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col className="ColContent">
                   <SeansCollection/>
                </Col>
            </Row>
            <Row>
                <Col>
                  <PagesSeans/>
                </Col>
            </Row>
            <CreateSeans  show={CSeansVisible} loc='create' onHide={() => setCSeansVisible(false)}/>
        </Container>
    );
});

export default Seans;