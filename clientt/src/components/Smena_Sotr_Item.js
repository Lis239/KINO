import React, {useContext} from 'react';
import { Button, Row,Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Context} from "../index";
import {delOneSmenaSotr} from "../http/smenasotrAPI";

const SmenaSotrItem = ({calDate,smen}) => {
    const {smenasotrs,user} = useContext(Context)
    const removeInfo =async (number) => {
        if (number){
            await delOneSmenaSotr(number).then(
                smenasotrs.setReload(!smenasotrs.getReload)
            )
        }
    }
    return (
        <Container breakpoint="sm" className="Container ContainerR">
            <Row className="mt-4 d-flex justify-content-center ">
                <Col className="mb-3"> <div>
                    {
                        (smen?.smena?.name||smen?.smena?.info)?
                        smen?.smena?.name+' '+smen?.smena?.info
                        :"Удалено"
                    }</div></Col>
                <Col className="mb-1">
                    <div>
                        Фио: {(smen?.User?.LName||smen?.User?.FName||smen?.User?.MName)?
                        smen?.User?.LName+" "+smen?.User?.FName+" "+smen?.User?.MName
                        :"Удалено"
                    }
                </div></Col>
                {user?.user?.rol==="admin"?
                    <Col className=""> <Button  onClick={()=> {
                        removeInfo(smen?.id_smena_sotr)
                    }}> Удалить </Button></Col>
                    :
                    <Col></Col>
                }
            </Row>
        </Container>
    );
};

export default SmenaSotrItem;
