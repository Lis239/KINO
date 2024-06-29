import React, {useContext, useState} from 'react';
import {Image, Button, Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import CreateFilm from "./AdminPanel/CreateFilm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Context} from "../index";


const FilmItem = ({film,Sel}) => {
    const [select, setSelect] = useState(null)
    const [CFilmVisible, setCFilmVisible] = useState(false)
    const {seans} = useContext(Context)
    const notify = (name,id) => toast.success("Выбран " +name+" C id="+id );

    return (
        <Container breakpoint="sm" className="Container ContainerG">
             <Row className="mt-4 d-flex justify-content-center " >
               <Col className="mb-3"> <Image width={150} height={200} src={process.env.REACT_APP_API_URL + film.img}/></Col>
                <Col className="mb-3"> <div>{film.name}</div></Col>
                <Col className="mb-1"> <div>{film.date}</div></Col>
                 {Sel?
                     <Col className="">
                         <div>
                         <Button  onClick={() => {
                             notify(film.name,film.id_film)
                             seans.setFILMID(film)
                         }}> Выбрать </Button>
                         <ToastContainer />
                         </div>
                     </Col>
                     :
                     <Col className=""> <Button  onClick={() => {
                         setSelect(film.id_film)
                         setCFilmVisible(true)
                     }}> Изменить </Button></Col>
                 }

        </Row>

            <CreateFilm show={CFilmVisible} loc={select} onHide={() => setCFilmVisible(false) }/>
    </Container>

    );
};

export default FilmItem;