import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SeansItem from "./SeansItem";

const SeansCollection = observer(() => {
    const {seans} = useContext(Context)
    return (
        <>
            {seans?.getSeans?.map(seans =>
                <SeansItem  key={seans.id_seans} seanss={seans}/>
            )}
        </>
    );
});

export default SeansCollection;




