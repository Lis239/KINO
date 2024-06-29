import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {fetchFilms} from "../../http/filmAPI";
import useDebounce from "../useDebounce";
import FilmCollection from "../FilmCollection";
import {Button, Col, Row} from "react-bootstrap";
import Pages from "../Pages";
import Modal from "react-bootstrap/Modal";

const SelectFilm  = observer(({show, onHide}) => {
    const {film} = useContext(Context)
    const debouncedSearchTerm = useDebounce(film.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);

    useEffect(() => {
        fetchFilms(1, film.getLimit,null).then(data => {
            film.setFilm(data.getFilm.rows)
            film.setTotalCount(data.getFilm.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function Searchfunc(data,film){
        if (data.getFilm?.rows){
            film.setFilm(data.getFilm.rows)
            setisNull(false)
        }
        if (data.getFilm?.count) {
            film.setTotalCount(data.getFilm.count)
        }
        if (!data.getFilm?.rows || !data.getFilm?.count){
            film.setFilm([])
            film.setTotalCount(0)
            setisNull(true)
        }
    }
    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                fetchFilms(film.getPage, film.getLimit,debouncedSearchTerm).then(data =>{
                    setIsSearching(false);
                    Searchfunc(data,film)
                });
            } else {
                fetchFilms(film.getPage, film.getLimit,'').then(data => {
                    Searchfunc(data,film)
                })
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm,film.getPage,film]);
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
                   Выбор фильма
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row  className="mt-2">
                <input className="form-control d-flex flex-column"
                       type="text"
                       placeholder="Поиск по названию"
                       value={film.getSearchT}
                       onChange={e => film.setSearchT(e.target.value)}
                />
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col>
                    <FilmCollection select={true}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Pages/>
                </Col>
            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default SelectFilm;