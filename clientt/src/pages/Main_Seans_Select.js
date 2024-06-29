import React, {useContext, useEffect, useState} from 'react';
import { Container, Image,Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row,Col} from "react-bootstrap";
import {fetchOneFilm} from "../http/filmAPI";
import { useNavigate, useParams} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import {Main_R} from "../utils/consts";
import {fetchOneMain} from "../http/mainAPI";
import MainInfoCollection from "../components/Main_Info_Collection";
import "../CSS/globla.css"
import MestaCollection from "../components/mestaCollection";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {createBilet} from "../http/blietAPI";
import {isEmpty} from "../components/globfunc";
import CreateOplata from "../components/AdminPanel/CreateOplata";
import {BronLimit, createBron} from "../http/bronAPI";

const MainSeansSelect = observer(() => {
    const {main} = useContext(Context)
    const {user} = useContext(Context)
    const {film} = useContext(Context)
    const {bilet} = useContext(Context)
    const history = useNavigate()
    const islogin=user.isAuth
    const {id} = useParams()
    const {date} = useParams()
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const [DisBut,setDisBut]=useState(true)
    const [COplataVisible,setCOplataVisible]=useState(false)
    const [loading,setLoading]=useState(true)
    const [info, setInfo] = useState([])
    const [sposob,setsposob]=useState("")
    const [type_creater,settype_creater]=useState("")
    const [time,settime]=useState("")
    const mesto=bilet.getMesto
    const [seanIdSeans,setseanIdSeans]=useState("")
    const [sum,setsum]=useState("")
    const [limitvalue, setLimitvalue] = useState(0);
    let formData = new FormData()
    function detect_iscass(rol){
        switch (rol) {
            case "admin":
                return true;
            case "user":
                return false;
            case "prod":
                return true;
            default:
                return "Войдите в свой акаунт"
        }
    }
    function detect_rol(rol){
        switch (rol) {
            case "admin":
                return "На кассе";
            case "user":
                return "На сайте";
            case "prod":
                return "На кассе";
            default:
                return "Войдите в свой акаунт"
        }
    }


    async function click2(){
        formData = new FormData()
        formData.append('sposob', sposob)
        formData.append('type_creater', type_creater)
        formData.append('date_create', new Date())
        formData.append('time', time)
        formData.append('mesto', mesto)
        formData.append('seanIdSeans', seanIdSeans)
        formData.append('sum', sum)
        if(islogin){
            try {
                    let bron = await createBron(formData)
                    setVIS(true)
                    if (bron.isCode === 200) {
                        setMSG('Данные сохранены (Проверьте в личном кабинете)')
                    }
                    if (bron.isCode !== 200) {
                        setMSG(bron.getmsg)
                    }
                } catch (e) {
                    setVIS(true)
                    setMSG(e.response.data.message)
                }
        }else {
            setVIS(true)
            setMSG("Бронирование и покупка доступна только зарегестрированным пользователям.")
        }

    }
    async function click(){
         formData = new FormData()
         formData.append('sposob', sposob)
         formData.append('type_creater', type_creater)
         formData.append('date_create', new Date())
         formData.append('time', time)
         formData.append('mesto', mesto)
         formData.append('seanIdSeans', seanIdSeans)
         formData.append('sum', sum)
            if(islogin){
                if(user.user.rol==="user"){
                    bilet.setformData(formData)
                    setCOplataVisible(true)
                }else {
                    try {
                        let bilet = await createBilet(formData)
                        setVIS(true)
                        if (bilet.isCode === 200) {
                            setMSG('Данные сохранены')
                        }
                        if (bilet.isCode !== 200) {
                            setMSG(bilet.getmsg)
                        }
                    } catch (e) {
                        setVIS(true)
                        setMSG(e.response.data.message)
                    }
                }
            }else {
                setVIS(true)
                setMSG("Бронирование и покупка доступна только зарегестрированным пользователям.")
            }

     }
    useEffect(() => {
        main.setSelectOSeans(null)
        setLimitvalue(0)
        setsum(0)
        settime(null)
        bilet.setMesto(null)
        bilet.setRad(null)
        bilet.setRadmesto(null)
        bilet.setMesta(null)
        if(!islogin){
            setVIS(true)
            setMSG("Войдите в свой аккаунт")
            setDisBut(true)
        }else {
            setVIS(false)
            setMSG("")
            setsposob(detect_rol(user.user.rol))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        if(isEmpty(mesto)&&isEmpty(main.getSelectOSeans?.id_seans)&&isEmpty(user?.user?.id)){
            setDisBut(false)
        }else {   setDisBut(true)}  // eslint-disable-next-line react-hooks/exhaustive-deps
    },[main.getSelectOSeans,user?.user?.rol,mesto])

    useEffect(() => {
        if(main.getSelectOSeans){
            setsum(main.getSelectOSeans?.price)
            setseanIdSeans(main.getSelectOSeans?.id_seans)
            settime(main.getSelectOSeans?.time_start)

        }else {
            setDisBut(true)
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    },[main.getSelectOSeans])


    useEffect(() => {
        setLimitvalue(0)
        if(user?.user?.id&&isEmpty(main.getSelectOSeans?.id_seans)) {

                BronLimit(main.getSelectOSeans?.id_seans).then(data =>
                    {

                        if (data.isCode === 200) {
                            setLimitvalue(data.getLimit)
                        }
                        if (data.isCode !== 200) {
                            setVIS(true)
                            setMSG(data.getmsg)
                        }
                    }
                )





            }

       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user?.user?.id,main.getSelectOSeans?.id_seans,bilet.getTriger])


    useEffect(() => {
        if(user?.user?.id){
            settype_creater(user?.user?.rol)
        }else {
            setDisBut(true)
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    },[user?.user?.id])

    useEffect(() => {
        setTimeout(()=> {
        fetchOneFilm(id).then(data => {
            film.setOFilm(data.getOFilm)
            if (film.getOFilm?.info) {
                setInfo([])
                for (const i of film.getOFilm.info) {
                    setInfo((info) => [...info, {title: i.title, coment: i.coment, number: i.id_info}])
                }
            }

        }).catch(e=>{history(Main_R)}
        ).finally(()=>{
            setLoading(false)
        })
        },500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        setTimeout(()=> {
            fetchOneMain(id,date).then(data => {
                main.setOMain(data.getOneMain)
            })
        },500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if (loading) {
        return <PacmanLoader className="d-flex Spin_W_CENT" animation={"grow"}/>
    }
    return (
        <Container
                   style={{height: window.innerHeight - 54}}
        >
            <Row className={"mt-4"}>
                <Col md={4} className="d-flex justify-content-start">
                    <Image width={200} height={300} src={process.env.REACT_APP_API_URL +film.getOFilm?.img}/>
                </Col>
                <Col>
                    {main.getSelMain?.film?.name}
                    <br/>
                        Aвтор: {film.getOFilm?.autor}
                    <br/>
                        Год выхода: {film.getOFilm?.date}
                    {info.map(i =>
                        <Row  key={i.number}>
                            <Col>
                                {i.title}:
                                {i.coment}
                            </Col>
                        </Row>
                    )}
                    <br/>
                        Описание: {film.getOFilm?.description}
                </Col>
            </Row>
            <Row >
                <Col>
                    <Container  className="Scroll_200">
                        <MainInfoCollection/>
                    </Container>
                </Col>
            </Row>
            <Row>
                {
                    main?.getSelectOSeans ?
                        <Row >
                            <div>{main?.getSelectOSeans.Zal.name}</div>
                            <div>Количетво мест: {main?.getSelectOSeans.Zal.mesta_count}</div>
                            <div> <Image style={{width:500 ,height:300}}   thumbnail  src={process.env.REACT_APP_API_URL + main?.getSelectOSeans.Zal.img}/></div>
                            <MestaCollection/>
                        </Row >
                :"Выбирите сеанс"
                }

            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Card style={{width: 600}}  className="p-3">
                    <h2 className="m-auto">Создание билета </h2>
                    { VISib ?
                        <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                                     onClick={()=> setVIS(false)}>X</Button></div>

                        : <div className="m-auto" style={{color:"white"}}>

                        </div>
                    }
                    <Form className="d-flex flex-column">
                        <Row><Col> {
                            detect_iscass(user.user.rol)? "Продавец"
                                :
                                "Покупатель"
                        } :
                            {   islogin?
                                " "+user.user.login
                                :
                                " Войдите в свой аккаунт"

                            }
                            </Col>
                        </Row>
                        <Row><Col>{main?.getSelectOSeans?.Zal?.name??"Сеанс не выбран"}</Col></Row>
                        <Row>
                            <Col md={3}><Form.Label>Время начала</Form.Label></Col>
                                <Col><Form.Control
                            className="mt-1"
                            placeholder="Время начала"
                            value={ time??" не выбрано"}
                            readOnly={true}
                        /></Col>
                            </Row>
                        <Row><Col>Ряд: { bilet.getRad??" не выбран"} Место: {bilet.getRadmesto??" не выбрано"}</Col></Row>

                        <Form.Label>Способ приобритения</Form.Label>
                        <Form.Control
                            className="mt-1"
                            placeholder="Способ приобритения"
                            value={ sposob??" не выбрано"}
                            readOnly={true}
                        />
                        <Form.Label>Сумма</Form.Label>
                        <Form.Control
                            className="mt-1"
                            placeholder="Сумма"
                            value={ sum??"0"}
                            readOnly={true}
                        />
                        <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                            <Button
                                variant={"outline-success"}
                                onClick={async () => {
                                        await click()
                                        bilet.setTriger(!bilet.getTriger)
                                }}
                                    disabled ={DisBut}
                            >
                                Купить билет
                            </Button>
                            <Button  className="mt-3"
                                variant={"outline-success"}
                                onClick={async ()=> {
                                    await click2()
                                    bilet.setTriger(!bilet.getTriger)
                                }}
                                     disabled  ={DisBut}
                            >
                                Бронировать  {user?.user?.rol!=='admin' ? limitvalue : ""}
                            </Button>
                        </Row>
                    </Form>
                </Card>
            </Row>
            <CreateOplata  show={COplataVisible} loc='create' onHide={() => setCOplataVisible(false)}/>
        </Container>
    );
});

export default MainSeansSelect;