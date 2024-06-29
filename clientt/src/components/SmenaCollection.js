import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SmenaItem from "./SmenaItem";

const SmenaCollection=  observer(() => {
    const {smena} = useContext(Context)
    return (
        <>
            {smena?.getSmena.map(smena =>
                <SmenaItem  key={smena.id_smena} id={smena.id_smena} smen={smena}/>
            )}
        </>
    );
});

export default SmenaCollection;



