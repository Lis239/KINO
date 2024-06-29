import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../index";
import useDebounce from "../components/useDebounce";
import {fetchSmens} from "../http/smenaAPI";
import Button from "react-bootstrap/Button";
import CreateSmena from "../components/AdminPanel/CreateSmena";
import SmenaCollection from "../components/SmenaCollection";


const Smena = observer(() => {
    const {smena} = useContext(Context)
    const debouncedSearchTerm = useDebounce(smena.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);
    const [CSmenaVisible,setCSmenaVisible]=useState(false)

    useEffect(() => {
        fetchSmens(null).then(data => {
            smena.setSmena(data?.getSmens?.rows)
            smena.setTotalCount(data?.getSmens?.count)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function Searchfunc(data,smena){
        if (data.getSmens?.rows){
            smena.setSmena(data.getSmens.rows)
            setisNull(false)
        }
        if (data.getSmens?.count) {
            smena.setTotalCount(data.getSmens.count)
            setisNull(false)
        }
        if (!data.getSmens?.rows || !data.getSmens?.count){
            smena.setSmena([])
            smena.setTotalCount(0)
            setisNull(true)

        }
    }


    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                fetchSmens(debouncedSearchTerm).then(data =>{
                    Searchfunc(data,smena)
                }).finally(setIsSearching(false));
            } else {
                fetchSmens('').then(data => {
                    Searchfunc(data,smena)
                })
            }
        }, [debouncedSearchTerm,smena,CSmenaVisible,smena.getSmena]);

    return (
        <Container className="d-flex flex-column">
            <Row  className="mt-2 ">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 mb-4  p-2"
                    onClick={() => setCSmenaVisible(true)}
                >
                    Добавить смену
                </Button>
                <input className="form-control d-flex flex-column"
                       type="text"
                       placeholder="Поиск по названию"
                       value={smena.getSearchT}
                       onChange={e => smena.setSearchT(e.target.value)}
                />
            </Row>
            <Row className="mt-4 d-flex justify-content-center " >
                <Col className="mb-2"> <label>Название</label></Col>
                <Col className="mb-4"> <label>Информация</label></Col>
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col>
                    <SmenaCollection/>
                </Col>
            </Row>
            <CreateSmena show={CSmenaVisible} loc='create' onHide={() => setCSmenaVisible(false)}/>
        </Container>
    );
});

export default Smena;