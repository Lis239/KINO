import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../CSS/globla.css"
import {useForm} from "react-hook-form";
import {fetchUsers, updateOneUser} from "../http/usersAPI";
import {Context} from "../index";


const SelectStatusUserItem = ({user}) => {
    const {users} = useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    }=useForm({mode:"onBlur"});

    const click = async (data) => {
        const formData = new FormData()
        formData.append("login",data.login ?? '')
        formData.append("lname",data.lname ?? '')
        formData.append("pass",data.pass)
        formData.append("fname",data.fname ?? '')
        formData.append("mname",data.mname ?? '')
        formData.append("email",data.email ?? '')
        formData.append("rol",data.rol ?? 'user')
        try {
            const data =await  updateOneUser(user.user_id,formData)
            if (data.isCode === 200) {
                setMSG('Данные сохранены')
                fetchUsers(1, users.getLimit,null).then(data => {
                        users.setUsers(data.getUsers.rows)
                        users.setTotalCount(data.getUsers.count)
                    })

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
    useEffect(() => {
        setVIS(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]  )
    useEffect(() => {
        setValue("login",user?.login)
        setValue("lname",user?.LName)
        setValue("fname",user?.FName)
        setValue("mname",user?.MName)
        setValue("email",user?.Email)
        setValue("rol",user?.rol)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users?.getOUser])

    return (
        <Container breakpoint="sm" style={{minWidth:390}} className="Cont_One">
            <Form>
                { VISib ?
                    <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                                 onClick={()=> setVIS(false)}>X</Button></div>

                    : <div className="m-auto" style={{color:"white"}}>

                    </div>
                }
                <label> Логин</label>
                <Form.Control
                    {...register("login",{required: "Данное поле необходимо заполнить"})}
                    className="mt-0"
                    control={control}
                    placeholder="Введите логин"
                />
                <>{errors?.login && <p>{errors?.login?.message||"Ошибка"}</p>}</>
                <label> Принудительная смена пароля (Пароль)</label>
                <Form.Control
                    {...register("pass",{required: false})}
                    className="mt-3"
                    control={control}
                    placeholder="Введите пароль"
                />
                <>{errors?.pass && <p>{errors?.pass?.message||"Ошибка"}</p>}</>
                <label> Фамилия</label>
                <Form.Control
                    {...register("lname",{required: "Данное поле необходимо заполнить"

                    })}
                    className="mt-0"
                    control={control}
                    placeholder="Введите вашу фамилию..."
                />
                <>{errors?.lname && <p>{errors?.lname?.message||"Ошибка"}</p>}</>
                <label> Имя</label>
                <Form.Control
                    {...register("fname",{required: "Данное поле необходимо заполнить"})}
                    className="mt-0"
                    control={control}
                    placeholder="Введите ваше имя..."
                />
                <>{errors?.fname && <p>{errors?.fname?.message||"Ошибка"}</p>}</>
                <label> Отчество</label>
                <Form.Control
                    {...register("mname",{required: "Данное поле необходимо заполнить"})}
                    className="mt-0"
                    control={control}
                    placeholder="Введите ваше отчество..."
                />
                <>{errors?.mname && <p>{errors?.mname?.message||"Ошибка"}</p>}</>
                <label> Email</label>
                <Form.Control
                    {...register("email",{required: "Данное поле необходимо заполнить"})}
                    className="mt-0"
                    control={control}
                    placeholder="Введите ваш email..."
                />
                <>{errors?.email && <p>{errors?.email?.message||"Ошибка"}</p>}</>
                <label> Роль</label>
                <Form.Select aria-label="Выбрать роль"
                  {...register("rol",{required: "Данное поле необходимо заполнить"})}
                >
                    <option value="admin">Администратор</option>
                    <option value="user">Пользователь</option>
                    <option value="prod">Продавец</option>
                </Form.Select>
                <Row className="d-flex justify-content-center align-items-center mt-3">
                    <Button className="col-6" variant={"outline-success"} onClick={handleSubmit(click)}>Сохранить</Button>
                </Row>
            </Form>

        </Container>

    );
};

export default SelectStatusUserItem;

