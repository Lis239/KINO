import React, {useContext} from 'react';
import {Col} from "react-bootstrap";
import {Context} from "../index";

const MestoItem = ({rads,mest,maxcoll,max,detect,detectbron,detectbuy}) => {
    const {bilet} = useContext(Context)
    const mesto=mest
    const rad=rads-1
    let glmesto=getmesto()

    const ismax=glmesto>max
    function getmesto(){
        let glmesto=null
        if(mesto!==maxcoll){
            glmesto=Number(rad*maxcoll+mesto);
        }else {
            glmesto=Number(rad)*maxcoll+maxcoll;
        }
        return glmesto
    }

    function onClick(){
        bilet.setMesto(glmesto)
        bilet.setRad(rad)
        bilet.setRadmesto(mesto)
    }

    return (
        <>
        {
            (ismax||detect)?
                <Col style={{height:"50px",width:"50px",minHeight:"50px",minWidth:"50px"}}

                 className={detectbron ?
                            "d-flex  Container_Col_Gray ContainerGray justify-content-center align-items-center align-self-center p-0 ms-1 "
                            : detectbuy ? "d-flex  Container_Col_B ContainerB justify-content-center align-items-center align-self-center p-0 ms-1 "
                                        :"d-flex  Container_Col_false ContainerR justify-content-center align-items-center align-self-center p-0 ms-1 "
                 }
                 id={"Item_"+rad+""+mesto}
                >  {mest}
                </Col>
            :
            <Col style={{height:"50px",width:"50px",minHeight:"50px",minWidth:"50px"}}
                 className=" d-flex Container ContainerG justify-content-center align-items-center align-self-center p-0 ms-1 "
                 id={"Item_"+rad+""+mesto}
                 onClick={onClick}
            >  {mest}
            </Col>
        }
    </>
    );
};

export default MestoItem;