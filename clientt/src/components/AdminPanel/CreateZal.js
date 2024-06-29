import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {createZall, fetchOneZal, fetchZal, updateOneZal} from "../../http/ZalAPI";
import {Context} from "../../index";

const CreateZal  = observer(({show, onHide,loc}) => {
    const {zal}=useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const [file, setFile] = useState(null)
    const [CL,setCL]=useState(false)
    const [ID,setID]=useState(null)
    const {
        register,
        control,
        formState: { errors },
        reset,
        handleSubmit,
        setValue
    }=useForm({mode:"onBlur"});
    const isZalCreate = loc === 'create'

    useEffect(() => {
        setVIS(false)
    },  [show,isZalCreate])

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    useEffect(() => {
        if (!isZalCreate && loc && show){

            fetchOneZal(loc).then(data => {
                zal.setOZal(data.getOZal)
                setID(zal.getOZal.id_zal)
                setValue('name',zal.getOZal.name)
                setValue('mesta_count',zal.getOZal.mesta_count)

            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [isZalCreate,show,loc,CL])

    const updZal = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('mesta_count',data.mesta_count)
        file ? formData.append('img', file)
            : formData.append('img', null)

        try {
            data = await updateOneZal(ID,formData)
            setVIS(true)
            if (data.getCode === 200) {
                setMSG('Данные сохранены')
                setCL(!CL)
                fetchZal(null).then(data => {
                    zal.setZal(data.getZal.rows)
                    zal.setTotalCount(data.getZal.count)
                })

            }
            if (data.getCode !== 200) {
                setMSG(data.getmsg)
            }
        }
        catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
        }
    }

    const cteateZAL = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('mesta_count',data.mesta_count)
        file ? formData.append('img', file)
            : formData.append('img', null)
        try {
           const  data =await  createZall(formData)
            setVIS(true)
            if (data.getCode === 200) {
                reset()
                setMSG('Данные сохранены')
            }
            if (data.getCode !== 200) {
                setMSG(data.getmsg)
            }

        } catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
        }

    }

    const EXIT=()=>{
        reset()
        onHide()
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
                {isZalCreate ?
                    'Добавить зал'
                    :
                    'Редактировать зал'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { VISib ?
                <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                             onClick={()=> setVIS(false)}>X</Button></div>

                : <div className="m-auto" style={{color:"white"}}>

                </div>
            }
            <Form>
            <Form.Control
                {...register("name",{required: "Данное поле необходимо заполнить"})}
                className="mt-3"
                control={control}
                placeholder="Введите название зала (номер)"
            />
            <>{errors?.name && <p>{errors?.name?.message||"Ошибка"}</p>}</>
            <Form.Control
                {...register("mesta_count", {
                        required: "Данное поле необходимо заполнить",
                        pattern:{
                        value:/^[0-9]/,
                        message: "Разрешены только числа",
                        required:true
                    }
                })


                }
                className="mt-3"
                control={control}
                placeholder="Введите количество мест"
            />
            <>{errors?.mesta_count && <p>{errors?.mesta_count?.message||"Ошибка"}</p>}</>

            { isZalCreate ?
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
            {isZalCreate ??<div>{errors?.file && <p>{errors?.file?.message||"Ошибка"}</p>}</div>}
        </Form>
        </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>

                { isZalCreate ? <Button type="submit" variant="outline-danger" onClick={handleSubmit(cteateZAL)}>Coxранить</Button>
                    :  <Button type="submit" variant="outline-danger" onClick={handleSubmit(updZal)}>Coxранить изменения</Button>}
            </Modal.Footer>
        </Modal>
    );
});

export default CreateZal;