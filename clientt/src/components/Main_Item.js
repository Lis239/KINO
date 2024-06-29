import React, {useContext} from 'react';
import {Image,Col} from "react-bootstrap";
import {Context} from "../index";
import Card from "@mui/material/Card";
import {useNavigate} from "react-router-dom";

const MainItem = ({mains}) => {
    const history = useNavigate()
    const {main} = useContext(Context)

    return (
        <Col md={4} className={"mt-3"}
             style={{width: 230}}
             onClick={() => {

                 main.setSelMain(mains)
                 history("../"+mains?.film?.id_film+"/"+mains?.d_date,
                     {
                         replace: true
                     }
                 )
        }}>
            <Card  className={"mt-2 mb-2"} style={{width: 200, cursor: 'pointer'}} border={"light"}>
                <Image width={200} height={250} src={process.env.REACT_APP_API_URL + mains.film.img}/>
                <div>{mains.film.name}</div>

            </Card>
        </Col>
    );
};

export default MainItem;