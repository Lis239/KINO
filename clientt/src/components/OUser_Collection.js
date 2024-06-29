import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SelectStatusUserItem from "./Select_Status_User_Item";
import {fetchOneUser} from "../http/usersAPI";


const OUsersCollection = observer(() => {
    const {users} = useContext(Context)
    useEffect(() => {
        if (users?.getSelID){
            fetchOneUser(users?.getSelID).then(data => {
                users.setOUser(data.getOUser)
            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [users.getSelID])
    return (
        <>
            {
                users.getSelID ?
                    <SelectStatusUserItem  key={users?.getOUser?.user_id} user={users?.getOUser}/>
                    :
                    <div>Пользователь не выбран</div>
            }


        </>
    );
});

export default OUsersCollection;