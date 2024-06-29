import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import FilmCollection from "../components/FilmCollection";
import Pages from "../components/Pages";
import {Context} from "../index";
import {fetchFilms} from "../http/filmAPI";
import useDebounce from '../components/useDebounce';


const Film= observer(() => {
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
        }, [debouncedSearchTerm,film.getPage,film]);

    return (
        <Container className="d-flex flex-column">
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
                        <FilmCollection/>
                    </Col>
                </Row>
            <Row>
                <Col>
                    <Pages/>
                </Col>
            </Row>

        </Container>
    );
});

export default Film;