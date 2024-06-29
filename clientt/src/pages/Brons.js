import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import useDebounce from "../components/useDebounce";
import {Button, Col, Container, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import {isEmpty} from "../components/globfunc";
import PagesBron from "../components/Pages_Bron";
import {fetchBron, updateBron} from "../http/bronAPI";
import BronCollection from "../components/BronCollection";
import {toast, ToastContainer} from "react-toastify";

const Brons = observer( ()=> {
    const notify = (msg) => toast.success(msg );
    const notifyer = (msg) => toast.error(msg );
    const {bron,user} = useContext(Context)
    const debouncedSearchTerm = useDebounce(bron.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);
    const [calDate, setCalDate] = useState(new Date(new Date().setHours(3,0,0)))
    const [isSearchDate,setSearchDate]=useState(false)
    const [isSearchAdmin,setSearchAdmin]=useState(false)
    const [isSearchID,setSearchID]=useState(null)
    function onChange (calDate) {
        setCalDate(calDate)
    }
    function onChangeSearchAdmin (e) {
        setSearchAdmin(e.target.checked)
    }
    function onChangeSearchDate (e) {
        setSearchDate(e.target.checked)
    }

    function onChangeSearchID (e) {
        if(isEmpty(e.target.value))
        {
            setSearchID(e.target.value)
        }else {
            setSearchID(null)
        }
    }
    async function clickcanselandex(id,metod,kode){
        let bronn;
        try {
            if(!isEmpty(id)&&!isEmpty(kode)){
                notifyer('Поля кода и ID не должны быть пустыми')
                return
            }
            bronn = await updateBron(id,metod,kode)
            if (bronn.isCode === 200) {
                notify('Данные сохранены',bronn.isCode)
                bron.setTriger(!bron.getTriger)
            }
            if (bronn.isCode !== 200) {
                notifyer(bronn.getmsg,bronn.isCode)
            }
        } catch (e) {
            notifyer(e?.response?.data?.message,bronn.isCode)
        }
    }
    function fetchBronS(isSearchDate,debouncedSearchTerm){

        if (!isSearchDate){
            fetchBron(isSearchID,isSearchAdmin ,bron.getPage, bron.getLimit,debouncedSearchTerm,null).then(data => {
                Searchfunc(data, bron)
            }).finally(() =>  setIsSearching(false));
        }
        if (isSearchDate){
            fetchBron(isSearchID,isSearchAdmin ,bron.getPage, bron.getLimit,debouncedSearchTerm,calDate).then(data => {
                Searchfunc(data, bron)
            }).finally(() =>  setIsSearching(false));
        }
    }
    function Searchfunc(data,bron){
        if (data.getBron?.bron?.rows||data.getBron?.bron){
            bron.setBron(data.getBron?.bron?.rows||data.getBron?.bron)
            setisNull(false)
        }
        if (data.getBron?.bron?.count||data.getBron?.count[0]?.count) {
            bron.setTotalCount(data.getBron?.bron?.count||data.getBron?.count[0]?.count)
        }
        if (!(data.getBron?.bron?.count>0||data.getBron?.count[0]?.count>0)){
            bron.setBron([])
            bron.setTotalCount(0)
            setisNull(true)
        }
    }
    useEffect(() => {
        setIsSearching(true);
        setTimeout(()=> {
            fetchBronS(isSearchDate,debouncedSearchTerm)
        },1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm,bron.getPage,isSearchDate,isSearchDate&&calDate,isSearchAdmin,isSearchID&isSearchAdmin,bron.getTriger]);

    useEffect(() => {
        bron.setPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm,isSearchDate&&calDate,isSearchID&isSearchAdmin,isSearchAdmin]);
    useEffect(() => {
        if (!isSearchDate){
            fetchBron(isSearchID,isSearchAdmin ,1, bron.getLimit,debouncedSearchTerm,null).then(data => {
                bron.setTotalCount(data.getBron?.bron?.count||data.getBron?.count[0]?.count)
            })
        }
        if (isSearchDate){
            fetchBron(isSearchID,isSearchAdmin ,1, bron.getLimit,debouncedSearchTerm,calDate).then(data => {
                bron.setTotalCount(data.getBron?.bron.count||data.getBron.count[0].count)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Container className="d-flex flex-column">
            <ToastContainer />
            {user.isAuth ?
                user?.user?.rol==='admin'||  user?.user?.rol==='prod' ?
            <Row  className="mt-2 ">
                <Col><input  className="form-control d-flex flex-column"
                             type="text"
                             placeholder="При подтверждении введите код сюда"
                             value={bron.getKode}
                             onChange={e => bron.setKod(e.target.value)}
                             onKeyPress={(event) => {
                                 if (!/^[0-9\b]+$/.test(event.key)) {
                                     event.preventDefault();
                                 }
                             }}
                /></Col>
            </Row> :<div/> :<div/>}
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
                        user?.user?.rol==='admin'||  user?.user?.rol==='prod' ?
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
                    {
                        user.isAuth ?
                                user?.user?.rol==='admin'||  user?.user?.rol==='prod'  ?

                                    <Row>

                                        <Col>
                                            { isSearchID ? "Список для пользователя с ID  (работает)  " : " Писок для пользователя с ID (не работает) "}
                                            <Col>
                                            <input className=" form-control d-flex flex-column"
                                                   type="text"
                                                   placeholder="Введите ID сюда"
                                                   onChange={onChangeSearchID}
                                                   onKeyPress={(event) => {
                                                       if (!/^[0-9\b]+$/.test(event.key)) {
                                                           event.preventDefault();
                                                       }
                                                   }}
                                            />
                                            </Col>



                                        </Col>

                                        <Col className="mt-1 d-flex flex-column justify-content-end"> <Button  onClick={async () => {
                                            await clickcanselandex(isSearchID,1,bron.getKode)
                                        }}> Подтвердить </Button></Col>

                                    </Row>
                                    :<div/>
                                :<div/>
                    }

                </Col>
                <Col>
                    <input className="form-control d-flex flex-column"
                           type="text"
                           placeholder="Поиск по названию"
                           value={bron.getSearchT}
                           onChange={e => bron.setSearchT(e.target.value)}
                    />

                </Col>
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col className="ColContent">
                    <BronCollection/>
                </Col>
            </Row>
            <Row className="mt-4 d-flex justify-content-center " >
                <Col className="mt-4 d-flex justify-content-center " >
                    <PagesBron/>
                </Col>
            </Row>

        </Container>

    );
});

export default Brons;