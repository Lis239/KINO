import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../index";
import MestoItem from "./Mesto_Item";
import {MySeansMesta, SeansMesta} from "../http/blietAPI";



const MestaCollection = observer(() => {
    const {main} = useContext(Context)
    const {bilet} = useContext(Context)
    let block = [];
    let dt=null;
    let rows=null;
    let maxcoll=bilet.get_maxcoll;
    let item = [];
    async function mests(id){
        try {
            let SM = await SeansMesta(id)
            if (SM.isCode === 200) {
                bilet.setMesta(SM.getMesta)
            }

        } catch (e) {
            console.log(e.response.data.message)
        }
        try {
            let SM = await MySeansMesta(id)
            if (SM.isCode === 200) {

                bilet.setMestaBuy(SM.getmestabuy)
                bilet.setMestaBron(SM.getmestabron)
            }
        } catch (e) {
            console.log(e.response.data.message)
        }

    }
    useEffect(() => {
        if (main?.getSelectOSeans.id_seans){
            mests(main?.getSelectOSeans.id_seans)
        }}// eslint-disable-next-line react-hooks/exhaustive-deps
        ,[])
    useEffect(() => {
            if (main?.getSelectOSeans.id_seans){
                mests(main?.getSelectOSeans.id_seans)
            }}// eslint-disable-next-line react-hooks/exhaustive-deps
        ,[bilet.getTriger])

    function getmesto(mesto,rad){
        rad=rad-1;
        let glmesto=null
        if(mesto!==maxcoll){
            glmesto=Number(rad*maxcoll+mesto);
        }else {
            glmesto=Number(rad)*maxcoll+maxcoll;
        }
        return glmesto
    }

    if (main?.getSelectOSeans){
        dt= main?.getSelectOSeans.Zal.mesta_count
        rows=Math.ceil( dt/maxcoll)
        for(var da=1;da<=rows;da++){
            item = []
            for(var mest=1;mest<=maxcoll;mest++){
                let detect=false;
                let detectbuy=false;
                let detectbron=false;
                if(bilet.getMesta){
                    detect=bilet.getMesta.includes(getmesto(mest,da))
                }
                if(bilet.getMestaBron){
                    detectbron=bilet.getMestaBron.includes(getmesto(mest,da))
                }
                if(bilet.getMestaBuy){
                    detectbuy=bilet.getMestaBuy.includes(getmesto(mest,da))
                }

                item.push(
                    <MestoItem  key={"Item_"+da+""+mest} detect={detect}  max={dt} mest={mest} maxcoll={maxcoll} detectbron={detectbron} detectbuy={detectbuy} rads={da} />
                  )
            }
            block.push(
                <Row className="d-flex justify-content-center align-items-center align-self-center"
                     key={da} >
                    <Col style={{height:"50px",width:"50px"}}
                         className=" d-flex  Container  ContainerG justify-content-center align-items-center align-self-center  p-0 "
                    >
                        Ряд {da}
                    </Col>
                    {item}
                </Row>
            )

        }
    }
    return (
        <Container >
            {block}
        </Container>
    );
});

export default MestaCollection;