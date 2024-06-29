import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SmenaSotrItem from "./Smena_Sotr_Item";

const SmenaSotrCollection=  observer(({calDate}) => {
    const {smenasotrs} = useContext(Context)
    return (
        <>
            {smenasotrs?.getSmenaSotr?.map(smenasotrs =>
                <SmenaSotrItem  key={smenasotrs.id_smena_sotr} calDate={calDate} smen={smenasotrs}/>
            )}
        </>
    );
});

export default SmenaSotrCollection;
