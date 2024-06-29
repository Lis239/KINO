import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import MainInfoItem from "./Main_Info_Item";

const MainInfoCollection = observer(() => {
    const {main} = useContext(Context)
    return (
        <>

            {main.getOMain?.seans?.rows.map(seanss =>
                <MainInfoItem key={seanss.id_seans} seanss={seanss}/>
            )}
        </>
    );
});

export default MainInfoCollection;