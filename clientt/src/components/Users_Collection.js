import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import StatusUserItem from "./Status_User_Item";


const UsersCollection = observer(() => {
    const {users} = useContext(Context)

    return (
        <>
            {users?.getUsers?.map(users =>
                    <StatusUserItem style={{minWidth:390}} key={users.user_id} user={users}/>)}
        </>
    );
});

export default UsersCollection;