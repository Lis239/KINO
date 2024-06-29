import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../index";
import useDebounce from '../components/useDebounce';
import {fetchUsers} from "../http/usersAPI";
import UsersCollection from "../components/Users_Collection";
import PagesUsers from "../components/Pages_Users";
import OUsersCollection from "../components/OUser_Collection";


const UsersStatus = observer(() => {
    const {users} = useContext(Context)
    const debouncedSearchTerm = useDebounce(users.getSearchT, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [isNull, setisNull] = useState(false);
    useEffect(() => {
        fetchUsers(1, users.getLimit,null).then(data => {
            users.setUsers(data.getUsers.rows)
            users.setTotalCount(data.getUsers.count)
        }).finally(() =>  setIsSearching(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function Searchfunc(data,users){
        if (data.getUsers.rows){
            users.setUsers(data.getUsers.rows)
            setisNull(false)
        }
        if (data.getUsers?.count) {
            users.setTotalCount(data.getUsers.count)
        }
        if (!data.getUsers?.rows || !data.getUsers?.count){
            users.setUsers([])
            users.setTotalCount(0)
            setisNull(true)
        }

    }
    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                setTimeout(()=> {
                    fetchUsers(users.getPage, users.getLimit, debouncedSearchTerm).then(data => {
                        Searchfunc(data, users)
                    }).finally(() =>  setIsSearching(false));
                },2000)
            } else {
                fetchUsers(users.getPage, users.getLimit,'').then(data => {
                    Searchfunc(data,users)
                })
            }
        }, [debouncedSearchTerm,users.getPage,users]);

    return (
        <Container className="d-flex flex-column">


            <Row >
                <Col className="ColContent">
                    <OUsersCollection/>
                </Col>
            </Row>

            <Row  className="mt-2">
                <input className="form-control d-flex flex-column"
                       type="text"
                       placeholder="Поиск по названию"
                       value={users.getSearchT}
                       onChange={e => users.setSearchT(e.target.value)}
                />
            </Row>
            <Row >{isSearching && <div>Поиск ...</div>}</Row>
            <Row >{isNull && <div>Извините, мы ничего не нашли ...</div>}</Row>
            <Row >
                <Col style={{minWidth:390}} className="ColContent">
                    <Row className="mt-4 d-flex justify-content-center" align="center">
                        <Col className="mb-1 flex-column"> <label className="">Логин</label></Col>
                        <Col className="mb-1 flex-column"> <label className="">Фамилия</label></Col>
                        <Col className="mb-1 flex-column" > <label className="">Имя</label></Col>
                        <Col className="mb-1 flex-column"> <label className="">Отчество</label></Col>
                        <Col className="mb-1 flex-column"> <label className="">Роль</label></Col>
                    </Row>
                </Col>
            </Row>
            <Row >
                <Col className="ColContent">
                    <UsersCollection style={{minWidth:390}}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <PagesUsers/>
                </Col>
            </Row>

        </Container>
    );
});

export default UsersStatus;