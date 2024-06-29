import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import useDebounce from "../useDebounce";
import {fetchZal} from "../../http/ZalAPI";
import Modal from "react-bootstrap/Modal";
import {Button, Col, Row} from "react-bootstrap";
import ZalCollection from "../ZalCollection";

const SelectZal = ({show, onHide}) => {
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




    const EXIT=()=>{
        onHide()
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Выбор Зала
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row  className="mt-2">
                    <input className="form-control d-flex flex-column"
                           type="text"
                           placeholder="Поиск по названию"
                           value={zal.getSearchT}
                           onChange={e => zal.setSearchT(e.target.value)}
                    />
                </Row>
                <Row >{isSearching && <div>Поиск ...</div>}</Row>
                <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
                <Row >
                    <Col>
                        <ZalCollection select={true}/>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SelectZal;