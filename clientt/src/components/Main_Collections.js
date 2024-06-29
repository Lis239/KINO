import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import MainItem from "./Main_Item";
import Card from "@mui/material/Card";
import {strtodata} from "./globfunc";


const MainCollection = observer(() => {
    const {main} = useContext(Context)
    const rows = [];
    let dt= main.getMainDate
    for (let i = 0; i < main.getMain.length; i++) {
        if (dt!==main.getMain[i].d_date){
            rows.push(
                <Card key={i+"C"}>
                    <Row key={i+"R"} className={"mt-3 ms-4 mb-3"}>
                        <h5>{strtodata(main.getMain[i].d_date)}</h5>
                    </Row>
                </Card>
            )
            dt=main.getMain[i].d_date
        }
        rows.push(

            <MainItem key={i} mains={main.getMain[i]}/>
            );
    }

    return (

        <Row className="d-flex">
            {rows}
        </Row>



    );
});

export default MainCollection;