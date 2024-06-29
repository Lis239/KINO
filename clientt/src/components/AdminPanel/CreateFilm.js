import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {delOneInfo, fetchFilms, fetchOneFilm, updateOneFilm, сreateFilm} from "../../http/filmAPI";
import {Context} from "../../index";


const CreateFilm  = observer(({show, onHide,loc}) => {
    const {film}=useContext(Context)
    const isFilmCreate = loc === 'create'
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const [CL,setCL]=useState(false)
    const [ID,setID]=useState(null)
    useEffect(() => {
        setVIS(false)
    },  [show,isFilmCreate])

    useEffect(() => {
        if (!isFilmCreate && loc && show){
            fetchOneFilm(loc).then(data => {
                film.setOFilm(data.getOFilm)
                setID(film.getOFilm.id_film)
                setValue('name',film.getOFilm.name)
                setValue('autor',film.getOFilm.autor)
                setValue('description',film.getOFilm.description)
                setValue('date',film.getOFilm.date)
                if (film.getOFilm?.info){
                    setInfo([])
                    for (const i of film.getOFilm.info) {
                        setInfo((info)=>[...info, {title: i.title, coment: i.coment, number: i.id_info}])
                    }
                }
            })

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [isFilmCreate,show,loc,CL])

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    }=useForm({mode:"onBlur"});

    const addInfo = (title,coment,number) => {
        setInfo([...info, {title: title ?? '', coment: coment ?? '', number: number ?? Date.now()}])
    }
    const removeInfo =async (number) => {
        setInfo(info.filter(i => i.number !== number))

        if (!isFilmCreate){
            if (number){
                await delOneInfo(number)
            }
        }
    }
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const EXIT=()=>{
        reset()
        onHide()
        setInfo([])
    }

    const updFilm = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('autor', data.autor)
        formData.append('description', data.description)
        formData.append('date', data.date)
        file ? formData.append('img', file)
             : formData.append('img', null)
        formData.append('info', JSON.stringify(info))

        try {
            data = await updateOneFilm(ID,formData)
            setVIS(true)
            if (data.isCode === 200) {
                setMSG('Данные сохранены')
                setCL(!CL)
                fetchFilms(1, film.getLimit,null).then(data => {
                    film.setFilm(data.getFilm.rows)
                    film.setTotalCount(data.getFilm.count)
                })

            }
            if (data.isCode !== 200) {
                setMSG(data.getmsg)
            }
        }
         catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
         }
    }

    const addFilm = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('autor', data.autor)
        formData.append('description', data.description)
        formData.append('date', data.date)
        formData.append('img', file)
        formData.append('info', JSON.stringify(info))
        try {
            data = await сreateFilm(formData)
            setVIS(true)
            if (data.isCode === 200) {
                setInfo([])
                reset()
                setMSG('Данные сохранены')
            }
            if (data.isCode !== 200) {
                setMSG(data.getmsg)
            }

        } catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
        }

    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isFilmCreate ?
                        'Добавить фильм'
                        :
                        'Редактировать фильм'}
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
                    <Form.Control
                        {...register("name",{required: "Данное поле необходимо заполнить"})}
                        className="mt-3"
                        control={control}
                        placeholder="Введите название фильма"
                    />
                    <>{errors?.name && <p>{errors?.name?.message||"Ошибка"}</p>}</>
                    <Form.Control
                        {...register("date",{required: "Данное поле необходимо заполнить"})}
                        className="mt-3"
                        control={control}
                        placeholder="Введите год выпуска фильма"
                    />
                    <>{errors?.date && <p>{errors?.date?.message||"Ошибка"}</p>}</>
                    <Form.Control
                        {...register("autor",{required: "Данное поле необходимо заполнить"})}
                        className="mt-3"
                        control={control}

                        placeholder="Введите главного режисера фильма"
                    />
                    <>{errors?.autor && <p>{errors?.autor?.message||"Ошибка"}</p>}</>
                    <Form.Control
                        {...register("description",{required: "Данное поле необходимо заполнить"})}
                        className="mt-3"
                        control={control}
                        placeholder="Введите описание фильма"
                    />
                    <>{errors?.description && <p>{errors?.description?.message||"Ошибка"}</p>}</>
                    { isFilmCreate ?
                        <Form.Control
                        {...register("file",{
                            required:"Файл не выбран",
                            validate: {
                            lessThan10MB: (files) => files[0]?.size < 3000000 || "Max 30kb",
                            acceptedFormats: (files) =>
                            ["image/jpeg", "image/png", "image/gif"].includes(
                            files[0]?.type) || "Только PNG, JPEG и GIF"}
                            })}
                        accept="image/png, image/jpeg"
                        control={control}
                        className="mt-3"
                        type="file"
                        onChange={selectFile}/>
                    :
                        <Form.Control
                            {...register("file",{required:false})}
                            control={control}
                            className="mt-3"
                            type="file"
                            onChange={selectFile}
                        />
                    }
                    {isFilmCreate ??<div>{errors?.file && <p>{errors?.file?.message||"Ошибка"}</p>}</div>}
                    <Button
                        variant={"outline-dark"}
                        onClick={()=>addInfo()}
                        className="mt-3"
                    >
                        Добавить новое свойство
                    </Button>
                    {info.map(i =>
                        <Row className="mt-4" key={i.number}>
                            <Col md={5} className="mt-2">
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название инфориации"
                                />
                            </Col>
                            <Col md={5} className="mt-2">
                                <Form.Control
                                    value={i.coment}
                                    onChange={(e) => changeInfo('coment', e.target.value, i.number)}
                                    placeholder="Введите данные"
                                />
                            </Col>
                            <Col md={2} className="mt-2">
                                <Button
                                    onClick={() => removeInfo(i.number)}
                                    variant={"outline-danger"}
                                >
                                    Удалить
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
                { isFilmCreate ? <Button type="submit" variant="outline-danger" onClick={handleSubmit(addFilm)}>Coxранить</Button>
                    :  <Button type="submit" variant="outline-danger" onClick={handleSubmit(updFilm)}>Coxранить изменения</Button>}
            </Modal.Footer>
        </Modal>
    );
});

export default CreateFilm;