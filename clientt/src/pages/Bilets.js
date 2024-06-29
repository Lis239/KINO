import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import PagesBilet from "../components/Pages_Bilet";
import {Col, Container, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import {Context} from "../index";
import useDebounce from "../components/useDebounce";
import {fetchBilet} from "../http/blietAPI";
import BiletCollection from "../components/BiletCollection";

const Bilets = observer( ()=> {
    const {bilet,user} = useContext(Context)
    const debouncedSearchTerm = useDebounce(bilet.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);
    const [calDate, setCalDate] = useState(new Date(new Date().setHours(3,0,0)))
    const [isSearchDate,setSearchDate]=useState(false)
    const [isSearchAdmin,setSearchAdmin]=useState(false)
    function onChange (calDate) {
        setCalDate(calDate)
    }
    function onChangeSearchAdmin (e) {
        setSearchAdmin(e.target.checked)
    }
    function onChangeSearchDate (e) {
        setSearchDate(e.target.checked)
    }

    function fetchBiletS(isSearchDate,debouncedSearchTerm){

        if (!isSearchDate){
            fetchBilet(isSearchAdmin ,bilet.getPage, bilet.getLimit,debouncedSearchTerm,null).then(data => {
                Searchfunc(data, bilet)
            }).finally(() =>  setIsSearching(false));
        }
        if (isSearchDate){
            fetchBilet(isSearchAdmin ,bilet.getPage, bilet.getLimit,debouncedSearchTerm,calDate).then(data => {
                Searchfunc(data, bilet)
            }).finally(() =>  setIsSearching(false));
        }
    }
    function Searchfunc(data,bilet){
        if (data.getBilet?.bilet?.rows||data.getBilet?.bilet){
            bilet.setBilet(data.getBilet?.bilet?.rows||data.getBilet?.bilet)
            setisNull(false)
        }
        if (data.getBilet?.bilet?.count||data.getBilet?.count[0]?.count) {
            bilet.setTotalCount(data.getBilet?.bilet?.count||data.getBilet?.count[0]?.count)
        }
        if (!(data.getBilet?.bilet?.count>0||data.getBilet?.count[0]?.count>0)){
            bilet.setBilet([])
            bilet.setTotalCount(0)
            setisNull(true)
        }
    }
    useEffect(() => {
        setIsSearching(true);
        setTimeout(()=> {
            fetchBiletS(isSearchDate,debouncedSearchTerm)
        },1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm,bilet.getPage,isSearchDate,isSearchDate&&calDate,isSearchAdmin]);
    useEffect(() => {

       bilet.setPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm,isSearchDate&&calDate]);
    useEffect(() => {
        if (!isSearchDate){
            fetchBilet(isSearchAdmin ,1, bilet.getLimit,debouncedSearchTerm,null).then(data => {
                bilet.setTotalCount(data.getBilet?.bilet.count||data.getBilet.count[0].count)
            })
        }
        if (isSearchDate){
            fetchBilet(isSearchAdmin ,1, bilet.getLimit,debouncedSearchTerm,calDate).then(data => {
                bilet.setTotalCount(data.getBilet?.bilet.count||data.getBilet.count[0].count)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (

        <Container className="d-flex flex-column">
            <Row  className="mt-2 ">
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
                    {user.isAuth ?
                        user?.user?.rol==='admin' ?
                            <Row>
                                <label>
                                    { isSearchAdmin ? "Список билетов (Все)  " : "Список билетов (Только мои) "}
                                    <input type="checkbox"
                                        onChange={onChangeSearchAdmin}
                                />
                            </label>
                        </Row>
                            :<div/>
                            :<div/>
                    }

                </Col>
                <Col>
                    <input className="form-control d-flex flex-column"
                           type="text"
                           placeholder="Поиск по названию"
                           value={bilet.getSearchT}
                           onChange={e => bilet.setSearchT(e.target.value)}
                    />

                </Col>
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col className="ColContent">
                    <BiletCollection/>
                </Col>
            </Row>
            <Row className="mt-4 d-flex justify-content-center " >
                <Col className="mt-4 d-flex justify-content-center " >
                    <PagesBilet/>
                </Col>
            </Row>
        </Container>
    );
});

export default Bilets;