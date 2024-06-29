import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {useForm} from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import {Button, Col, Form, Row} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import SelectFilm from "../SelectedModul/SelectFilm";
import SelectZal from "../SelectedModul/SelectZal";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {createSeans, fetchOneSeans, updateOneSeans} from "../../http/seansAPI";

const CreateSeans = observer(({show, onHide,loc}) => {
    const {seans}=useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const [CL,setCL]=useState(false)
    const [ID,setID]=useState(null)

    const Time=new Date(new Date().setHours(0,0,0))
    const [calDate, setCalDate] = useState(new Date(new Date().setHours(3,0,0)))

    const [calTime, setCalTime] = useState(new Date(new Date().setSeconds(0)))
    const [ruTime, setruTime] = useState(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(calTime))

    const [EcalTime, setECalTime] = useState(new Date(new Date().setSeconds(0)))
    const [EruTime, setEruTime] = useState(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(EcalTime))

    const [DcalTime, setDCalTime] = useState(Time)
    const [DruTime, setDruTime] = useState(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(DcalTime))


    const [ZalVisible, setZalVisible] = useState(false)
    const [FilmVisible, setFilmVisible] = useState(false)


    function onChange (calDate) {
        setCalDate(calDate)
        setValue('date',calDate.toISOString())
    }

    function onChangeTime (caTime) {
        // change results based on calendar date click

        setCalTime(caTime)
        setruTime(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(calTime));
        setValue('time_start',ruTime)
        setECalTime(caTime)
        const Time=new Date( EcalTime.setHours(caTime?.getHours()+DcalTime?.getHours(),calTime?.getMinutes()+DcalTime?.getMinutes()))
        setECalTime(Time)
        setEruTime(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(EcalTime));
        setValue('time_end',EruTime)

    }
    function onChangeVIS (e) {
        setCh(e.target.checked)
        setValue("Vis",e.target.checked)
    }

    function onChangeTimeD (DcalTime) {
        // change results based on calendar date click
        setDCalTime(DcalTime)
        setDruTime(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(DcalTime));
        setValue('duration',DruTime)
        setECalTime(calTime)
        const Time=new Date( EcalTime.setHours(calTime?.getHours()+DcalTime?.getHours(),calTime.getMinutes()+DcalTime?.getMinutes()))
        setECalTime(Time)
        setEruTime(new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(EcalTime));
        setValue('time_end',EruTime)
        //console.log(new Intl.DateTimeFormat("ru",{timeStyle: "short"}).format(calTime.getTime()- DcalTime.getTime()))

    }
    const updSeanss = async (data) => {
        const formData = new FormData()
        formData.append('date', data.date)
        formData.append('filmIdFilm',data.filmIdFilm)
        formData.append('ZalIdZal', data.ZalIdZal)
        formData.append('time_start',data.time_start)
        formData.append('duration', data.duration)
        formData.append('time_end',data.time_end)
        formData.append('price', data.price)
        formData.append('Vis',data.Vis)

        try {
            data = await updateOneSeans(ID,formData)
            setVIS(true)
            if (data.getCode === 200) {
                seans.setReload(!seans.getReload)
                setMSG('Данные сохранены')
                setCL(!CL)
            }
            if (data.getCode !== 200) {
                setMSG(data.getmsg)
            }
        }
        catch (e) {
            setVIS(true)
            setMSG(e?.response?.data?.message)
        }

    }
    const cteateSeanss = async (data) => {
        const formData = new FormData()
        formData.append('date', data.date)
        formData.append('filmIdFilm',data.filmIdFilm)
        formData.append('ZalIdZal', data.ZalIdZal)
        formData.append('time_start',data.time_start)
        formData.append('duration', data.duration)
        formData.append('time_end',data.time_end)
        formData.append('price', data.price)
        formData.append('Vis',data.Vis)
        try {
            const  data =await  createSeans(formData)
            setVIS(true)
            if (data.getCode === 200) {
                reset()
                seans.setReload(!seans.getReload)
                setMSG('Данные сохранены')
            }
            if (data.getCode !== 200) {
                setMSG(data.getmsg)
            }

        } catch (e) {
            setVIS(true)
            setMSG(e.response?.data?.message)
        }

    }
    const {
        register,
        control,
        formState: { errors },
        reset,
        handleSubmit,
        setValue,
        getValues
    }=useForm({mode:"onBlur"});
    const [isCh,setCh]=useState(getValues("Vis"))
    const isSeansCreate = loc === 'create'
    const EXIT=()=>{
        reset()
        onHide()
    }

    useEffect(() => {
        if (!isSeansCreate && loc && show){
            fetchOneSeans(loc).then(data => {
                seans.setOSeans(data?.getOSeans)
                setID(seans.getOSeans?.id_seans)
                if (seans.getOSeans?.filmIdFilm){
                    seans.setFILMID(seans.getOSeans?.filmIdFilm)
                }
                if(seans.getOSeans?.ZalIdZal){
                    seans.setZALID(seans.getOSeans?.ZalIdZal)
                }
                setValue('filmIdFilm',seans.getOSeans?.filmIdFilm)
                setValue('ZalIdZal',seans.getOSeans?.ZalIdZal)
                setCalDate(new Date(seans.getOSeans?.date+"T00:00:00.000Z"))
                setValue('Vis',seans.getOSeans?.Vis)
                setCh(seans.getOSeans?.Vis)
                setCalTime(new Date(seans.getOSeans?.date+"T"+seans.getOSeans?.time_start))
                setDCalTime(new Date(seans.getOSeans?.date+"T"+seans.getOSeans?.duration))
                setValue('price',seans.getOSeans?.price)

            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [isSeansCreate,show,loc,CL])

    useEffect(() => {
        onChangeTime(calTime)
        onChangeTimeD(DcalTime)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [calTime,DcalTime])


    useEffect(() => {
        setVIS(false)
    },  [show,isSeansCreate])

    useEffect(() => {
        setValue('date',calDate.toISOString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[show,calDate])

    useEffect(() => {
            setValue('time_start', ruTime)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[show,ruTime,calTime,DruTime])

    useEffect(() => {
            setValue('time_end', EruTime)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[show,EruTime,DruTime])

    useEffect(() => {
            setValue('duration', DruTime)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[show,DruTime,DcalTime])

    useEffect(() => {
        if (seans.getFILMID){
            setValue('filmIdFilm',seans.getFILMID.id_film)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[FilmVisible])

    useEffect(() => {
        if (seans.getZALID) {
            setValue('ZalIdZal', seans.getZALID.id_zal)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ZalVisible])

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isSeansCreate ?
                        'Добавить сеанс'
                        :
                        'Редактировать сеанс'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { VISib ?
                    <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                                 onClick={()=> setVIS(false)}>X</Button></div>

                    : <div className="m-auto" style={{color:"white"}}>

                    </div>
                }
                <Form >
                <Row className="d-flex justify-content-center">

                        <Row><Button onClick={() => onChange(new Date(new Date().setHours(3,0,0)))}>Сегодня</Button></Row>

                        <Row>
                              <Col>
                                  <DatePicker
                                className="mt-2 DatPic_H"
                                selected={ calDate }
                                onChange={ onChange }
                                name="startDate"
                                dateFormat="dd/MM/yyyy"
                                locale={ru}
                                />
                                </Col>
                                <Col className="text-end mt-2">
                                        Дата назначения:
                                </Col>
                                <Col className='p-0' style={{minWidth:135,maxWidth:135}}>
                                <Form.Control
                                    className="mt-2"
                                    {...register("date",{
                                        required:"Поле не должно быть пустым"
                                    })}
                                disabled
                                control={control}
                            />
                                    </Col>
                        </Row>
                        <>{errors?.date && <p>{errors?.date?.message||"Ошибка"}</p>}</>
                        <Row className="mt-2">
                            <Col>
                            <Row>
                                <Button  variant={"outline-dark"}
                                         onClick={() =>{
                                             setFilmVisible(true)
                                         }}
                                >
                                    Выбрать Фильм
                                </Button>
                                <Form.Control
                                    className="mt-1"
                                    {...register("filmIdFilm",
                                        {
                                            required:"Поле не должно быть пустым"
                                        }
                                    )}
                                    disabled
                                    placeholder="Фильм не выбран"
                                    control={control}
                                />
                            </Row>
                            </Col>
                        </Row>
                    <>{errors?.filmIdFilm && <p>{errors?.filmIdFilm?.message||"Ошибка"}</p>}</>
                    <Row className="mt-2">
                        <Col>
                            <Row>
                                <Button  variant={"outline-dark"}
                                         onClick={() =>{
                                             setZalVisible(true)
                                         }}
                                >
                                    Выбрать Зал
                                </Button>
                                <Form.Control
                                    className="mt-1"
                                    {...register("ZalIdZal",
                                        {
                                            required:"Поле не должно быть пустым"
                                        }
                                    )}
                                    disabled
                                    placeholder="Зал не выбран"
                                    control={control}
                                />
                            </Row>
                        </Col>
                    </Row>
                    <>{errors?.ZalIdZal && <p>{errors?.ZalIdZal?.message||"Ошибка"}</p>}</>
                    <Row className="mt-2"><Button onClick={() => onChangeTime(new Date(new Date().setSeconds(0)))}>Сейчас</Button></Row>
                    <Row className="mt-2">
                        <Col style={{minWidth:135,maxWidth:135}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru} >
                                <TimePicker
                                    value={calTime}
                                    onChange={onChangeTime}
                                />
                            </LocalizationProvider>
                        </Col>
                            <Col className="text-end mt-2">
                                Время начала:
                            </Col>
                            <Col className='p-0' style={{minWidth:135,maxWidth:135}}>
                                <Form.Control
                                    className="mt-2"
                                    {...register("time_start",
                                        {
                                            required:"Поле не должно быть пустым"
                                        }
                                    )}
                                    disabled
                                    control={control}
                                />
                            </Col>
                        <>{errors?.time_start && <p>{errors?.time_start?.message||"Ошибка"}</p>}</>
                    </Row>
                    <Row className="mt-2">
                        <Col  style={{minWidth:135,maxWidth:135}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru} >
                                <TimePicker
                                    value={DcalTime}
                                    onChange={onChangeTimeD}
                                />
                            </LocalizationProvider>
                        </Col>
                        <Col className="text-end mt-2">
                            Продолжительность:
                        </Col>
                        <Col className='p-0' style={{minWidth:135,maxWidth:135}}>
                            <Form.Control
                                className="mt-2"
                                {...register("duration",
                                    {
                                        required:"Поле не должно быть пустым"
                                    }
                                )}
                                disabled
                                control={control}
                            />
                        </Col>
                        <>{errors?.duration && <p>{errors?.duration?.message||"Ошибка"}</p>}</>
                    </Row>


                    <Row className="mt-2">
                        <Col>

                        </Col>
                        <Col className="text-end mt-2">
                            Время окончания:
                        </Col>
                        <Col className='p-0' style={{minWidth:135,maxWidth:135}}>
                            <Form.Control
                                className="mt-2"
                                {...register("time_end",
                                    {
                                        required:"Поеле не должно быть пустым"
                                    }
                                )}
                                disabled
                                control={control}
                            />
                        </Col>
                        <>{errors?.time_end && <p>{errors?.time_end?.message||"Ошибка"}</p>}</>
                    </Row>
                    <Row className="mt-2">
                        <Col className="text-start mt-2">
                            Цена билетов:
                            <Form.Control
                                type="number"
                                className="mt-2"
                                defaultValue="0"
                                max="5000"
                                min="0"
                                {...register("price",
                                    {
                                        required:"Поеле не должно быть пустым",
                                        valueAsNumber: true,
                                        max:{value:5000,message:"Максимум 5000"},
                                        min:{value:0,message:"Минимум 0"}
                                    }
                                )}
                                onKeyPress={(event) => {
                                    if (!/^[0-9\b]+$/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                control={control}
                            />
                        </Col>
                        <>{errors?.price && <p>{errors?.price?.message||"Ошибка"}</p>}</>
                    </Row>
                    <Row className="mt-2">
                        <Col className="text-start mt-2">
                            Видимость на главном окне (
                            {
                                isCh
                                    ? "ДА"
                                    : "НЕТ"
                            }
                        )
                            <Form.Check
                                className="mt-2"
                                {...register("Vis",

                                )}
                                onChange={onChangeVIS}
                                control={control}
                            />
                        </Col>
                    </Row>
                </Row>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
                { isSeansCreate ? <Button type="submit" variant="outline-danger" onClick={handleSubmit(cteateSeanss)}>Coxранить</Button>
                    :  <Button type="submit" variant="outline-danger" onClick={handleSubmit(updSeanss)}>Coxранить изменения</Button>}
            </Modal.Footer>
            <SelectFilm  show={FilmVisible} onHide={() =>{setFilmVisible(false)}}/>
            <SelectZal show={ZalVisible} onHide={() =>{setZalVisible(false)}}/>
        </Modal>
    );
})

export default CreateSeans;