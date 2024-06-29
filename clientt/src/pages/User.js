import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import {Button, Card, Form, Row} from "react-bootstrap";
import {Context} from "../index";
import "../CSS/local.css"
import {SUser, fetchOneUs} from "../http/userAPI";
import {useParams,useNavigate} from 'react-router-dom'
import PacmanLoader from "react-spinners/PacmanLoader";
import {useForm} from "react-hook-form";

const User =observer(() => {
    const {user} = useContext(Context)
    const {id} = useParams()
    const history  = useNavigate()
    const [loading,setLoading]=useState(true)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue
    }=useForm({mode:"onBlur"});

    useEffect(() => {
        setVIS(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]  )
    useEffect(() => {
        setTimeout(()=> {
        fetchOneUs(id).then(user => {
            if (user.isCode===200){
                setValue("login",user.getUser?.login)
                setValue("lname",user.getUser?.LName)
                setValue("fname",user.getUser?.FName)
                setValue("mname",user.getUser?.MName)
                setValue("email",user.getUser?.Email)
                }
            else {
                history(-1)
                setMSG(user.getmsg)
                setVIS(true)
            }
        }).catch(e=>{
                setMSG(e.response.data.message)
                setVIS(true)
            }
        ).finally(()=>{
            setLoading(false)
        })
        },1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id,history] )

    if (loading) {
        return <PacmanLoader className="d-flex Spin_W_CENT" animation={"grow"}/>
    }
    const click = async (data) => {
        if (!data.newpass||!data.pass){
            if (data.newpass!==data.pass){
                setVIS(true)
                setMSG("Введенныее пароли не совпадают")
                return
            }
        }
        const formData = new FormData()
        formData.append("login",data.login ?? '')
        formData.append("lname",data.lname ?? '')
        formData.append("pass",data.pass)
        formData.append("newpass",data.newpass ?? '')
        formData.append("fname",data.fname ?? '')
        formData.append("mname",data.mname ?? '')
        formData.append("email",data.email ?? '')
        try {
            const data =await  SUser(id,formData)
            if (data.isCode === 200) {
                setMSG('Данные сохранены')
            }
            if (data.isCode !== 200) {
                setMSG(data.getmsg)
            }
            setVIS(true)
        } catch (e) {
            setVIS(true)
            setMSG(e.response.data.message)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center"    style={{height: window.innerHeight - 54}}>
            <Card style={{width: 600,minWidth:340}} className="p-5">
                <h2 className="m-auto">{user?.user?.rol==="user" ? 'Профиль пользователя' : user?.user?.rol==="prod" ? "Профиль кассира" : "Профиль администратора"}</h2>
                { VISib ?
                    <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                                 onClick={()=> setVIS(false)}>X</Button></div>

                    : <div className="m-auto" style={{color:"white"}}>

                    </div>
                }



            <Form className="d-flex flex-column">
                <Form.Control
                    {...register("login",{required: "Данное поле необходимо заполнить"})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите логин"
                />
                <>{errors?.login && <p>{errors?.login?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("pass",{required: false})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите старый пароль"
                />
                <>{errors?.pass && <p>{errors?.pass?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("newpass",{required: false})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите новый пароль"
                />
                <>{errors?.newpass && <p>{errors?.newpass?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("lname",{required: "Данное поле необходимо заполнить"

                    })}
                    className="mt-3"
                    control={control}
                    placeholder="Введите вашу фамилию..."
                />
                <>{errors?.lname && <p>{errors?.lname?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("fname",{required: "Данное поле необходимо заполнить"})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите ваше имя..."
                />
                <>{errors?.fname && <p>{errors?.fname?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("mname",{required: "Данное поле необходимо заполнить"})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите ваше отчество..."
                />
                <>{errors?.mname && <p>{errors?.mname?.message||"Ошибка"}</p>}</>
                <Form.Control
                    {...register("email",{required: "Данное поле необходимо заполнить"})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите ваш email..."
                />
                <>{errors?.email && <p>{errors?.email?.message||"Ошибка"}</p>}</>

                        <Row className="d-flex justify-content-center align-items-center mt-3">
                            <Button className="col-6" variant={"outline-success"} onClick={handleSubmit(click)}>Сохранить</Button>
                        </Row>
            </Form>
            </Card>
        </Container>
    );
});

export default User;