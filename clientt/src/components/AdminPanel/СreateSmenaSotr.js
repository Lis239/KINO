import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Modal from "react-bootstrap/Modal";
import {Button, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {createSmensSotr, fetchUsersRol} from "../../http/smenasotrAPI";
import {fetchSmens} from "../../http/smenaAPI";


const СreateSmenaSotr  = observer(({show, onHide,date}) => {
    const {smenasotrs}=useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const EXIT=()=>{
        reset()
        onHide()
    }
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    }=useForm({mode:"onBlur"});

    const cteateSmenaSotr = async (data) => {
        const formData = new FormData()
        formData.append('date', date)
        formData.append('smenaIdSmena',data?.smenaIdSmena)
        formData.append('UserUserId',data?.UserUserId)
        try {
            const  data =await  createSmensSotr(formData)
            setVIS(true)
            if (data.getCode === 200) {
                reset()
                setMSG('Данные сохранены')
                setValue('date',new Intl.DateTimeFormat("ru", {dateStyle: "short"}).format(date))
            }
            if (data.getCode !== 200) {
                setMSG(data.getmsg)
            }

        } catch (e) {
            setVIS(true)
            setMSG(e.response?.data?.message)
        }

    }

    useEffect(() => {
        setValue('date',new Intl.DateTimeFormat("ru", {dateStyle: "short"}).format(date))

        fetchUsersRol('prod').then(data => {
            smenasotrs.setSotr(data.getUsers)
        })
        fetchSmens(null).then(data => {
            smenasotrs.setSmena(data?.getSmens?.rows)

        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [show,date])
    useEffect(() => {
        setVIS(false)
        }, [show])
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Назначение смен
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
                    <Row>
                        <Form.Label>
                            Выбрана дата
                        </Form.Label>
                        <Form.Control
                            {...register("date",
                                {
                                valueAsDate: true,
                                }
                            )}
                            disabled
                            control={control}
                            placeholder="Введите название смены "
                        />
                        <>{errors?.date && <p>{errors?.date?.message||"Ошибка"}</p>}</>
                    </Row>
                    <Row>
                        <Form.Label title='Smena' className="mt-3">
                            Выбран сотрудник
                        </Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue='0'
                                {...register("UserUserId",
                                    {
                                        required: "Данное поле необходимо заполнить",
                                        validate: value => value !== '0' || 'Сотрудник не выбран'

                                    }
                                )}

                                control={control}
                            >
                                <Form.Control as='option' value='0' >
                                    Выбор сотрудника
                                </Form.Control>
                                {smenasotrs?.sotr?.map(sotrs =>
                                    <Form.Control as='option' value={sotrs.user_id}
                                        onClick={() => smenasotrs.setSelectedSotr(sotrs)}
                                        key={sotrs.user_id}
                                    >
                                       Логин: {sotrs.login} ФИО: {sotrs.LName+sotrs.FName+sotrs.MName}
                                    </Form.Control>
                                )}
                            </Form.Control>
                        <>{errors?.UserUserId && <p>{errors?.UserUserId?.message||"Ошибка"}</p>}</>
                    </Row>
                    <Row>
                        <Form.Label className="mt-3">
                            Выбрана смена
                        </Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue='0'
                            {...register("smenaIdSmena",
                                {
                                    required: "Данное поле необходимо заполнить",
                                    validate: value => value !== '0' || 'Смена не выбрана'
                                }
                            )}
                            control={control}
                        >
                            <Form.Control as='option' value='0' >
                                Выбор смены
                            </Form.Control>
                            {smenasotrs?.getsmena?.map(smen =>
                                <Form.Control as='option' value={smen.id_smena}
                                              onClick={() => smenasotrs.setSelectedSmena(smen)}
                                              key={smen.id_smena}
                                >
                                    Смена: {smen.name}
                                </Form.Control>
                            )}
                        </Form.Control>
                        <>{errors?.UserUserId && <p>{errors?.UserUserId?.message||"Ошибка"}</p>}</>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button  variant="outline-danger"
                         className="col-6"
                         onClick={handleSubmit(cteateSmenaSotr)}
                >Назначить
                </Button>
                <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default СreateSmenaSotr;