import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {useForm} from "react-hook-form";
import {createSmens, fetchOneSmena, fetchSmens, updateOneSmena} from "../../http/smenaAPI";
import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";


const CreateSmena = observer(({show, onHide,loc}) => {
    const {smena}=useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
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
    const isSmenaCreate = loc === 'create'
    const EXIT=()=>{
        reset()
        onHide()
    }


    const cteateSmena = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('info',data.info)
        try {
            const  data =await  createSmens(formData)
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
            setMSG(e.response?.data?.message)
        }

    }

    const updSmena = async (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('info', data.info)
        try {
            data = await updateOneSmena(ID,formData)
            setVIS(true)
            if (data.getCode === 200) {
                setMSG('Данные сохранены')
                setCL(!CL)
                fetchSmens(null).then(data => {
                    smena.setSmena(data.getSmens.rows)
                    smena.setTotalCount(data.getSmens.count)
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


    useEffect(() => {
        if (!isSmenaCreate && loc && show){
            fetchOneSmena(loc).then(data => {
                smena.setOSmena(data.getOSmena)
                setID(smena.getOSmena?.id_smena)
                setValue('name',smena.getOSmena.name)
                setValue('info',smena.getOSmena.info)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [isSmenaCreate,show,loc,CL])
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered

            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isSmenaCreate ?
                        'Добавить смену'
                        :
                        'Редактировать смену'}
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
                        placeholder="Введите название смены "
                    />
                    <>{errors?.name && <p>{errors?.name?.message||"Ошибка"}</p>}</>
                    <Form.Control
                        {...register("info", {
                            required: "Данное поле необходимо заполнить",
                        })}
                        className="mt-3"
                        control={control}
                        placeholder="Введите информации по смене"
                    />
                    <>{errors?.mesta_count && <p>{errors?.mesta_count?.message||"Ошибка"}</p>}</>

                    {isSmenaCreate ??<div>{errors?.file && <p>{errors?.file?.message||"Ошибка"}</p>}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>

                { isSmenaCreate ? <Button type="submit" variant="outline-danger" onClick={handleSubmit(cteateSmena)}>Coxранить</Button>
                    :  <Button type="submit" variant="outline-danger" onClick={handleSubmit(updSmena)}>Coxранить изменения</Button>}
            </Modal.Footer>
        </Modal>
    );
});

export default CreateSmena;