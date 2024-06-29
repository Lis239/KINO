import React, {useContext} from 'react';
import FilmItem from "./FilmItem";
import {observer} from "mobx-react-lite";
import {Context} from "../index";


const FilmCollection = observer(({select=false}) => {
    const {film} = useContext(Context)
    return (
        <>
                {film?.getFilm?.map(film =>
                    <FilmItem Sel={select} key={film.id_film} film={film}/>
                )}
        </>
    );
});

export default FilmCollection;