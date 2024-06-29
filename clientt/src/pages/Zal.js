import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../index";
import useDebounce from "../components/useDebounce";
import {fetchZal} from "../http/ZalAPI";
import ZalCollection from "../components/ZalCollection";

const Zal= observer(() => {
    const {zal} = useContext(Context)
    const debouncedSearchTerm = useDebounce(zal.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);


    useEffect(() => {
        fetchZal(null).then(data => {
            zal.setZal(data?.getZal?.rows)
            zal.setTotalCount(data?.getZal?.count)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function Searchfunc(data,zal){
        if (data.getZal?.rows){
            zal.setZal(data.getZal.rows)
            setisNull(false)
        }
        if (data.getZal?.count) {
            zal.setTotalCount(data.getZal.count)

        }
        if (!data.getZal?.rows || !data.getZal?.count){
            zal.setZal([])
            zal.setTotalCount(0)
            setisNull(true)
        }
    }


    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                fetchZal(debouncedSearchTerm).then(data =>{
                    setIsSearching(false);
                    Searchfunc(data,zal)
                });
            } else {
                fetchZal('').then(data => {
                    Searchfunc(data,zal)
                })
            }
        }, [debouncedSearchTerm,zal]);




    return (
        <Container className="d-flex flex-column">
            <Row  className="mt-2 ">
                <input className="form-control d-flex flex-column"
                       type="text"
                       placeholder="Поиск по названию"
                       value={zal.getSearchT}
                       onChange={e => zal.setSearchT(e.target.value)}
                />
            </Row>
            <Row className="mt-4 d-flex justify-content-center " >
                <Col className="mb-3"> <label>Изображение расстановки мест</label></Col>
                <Col className="mb-3"> <label>Название</label></Col>
                <Col className="mb-1"> <label>Количество мест</label></Col>
                <Col className=""> <label>Действие</label></Col>
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col>
                    <ZalCollection/>
                </Col>
            </Row>
        </Container>
    );
});

export default Zal;