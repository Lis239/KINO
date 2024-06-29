import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import ZalItem from "./ZalItem";

const ZalCollection=  observer(({select=false}) => {
    const {zal} = useContext(Context)
    return (
        <>
            {zal?.getZal?.map(zal =>
                <ZalItem  Sel={select}  key={zal.id_zal} zal={zal}/>
            )}
        </>
    );
});

export default ZalCollection;






;