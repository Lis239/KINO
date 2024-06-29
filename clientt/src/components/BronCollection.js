import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import BronItem from "./Bron_Item";
import {ToastContainer,toast} from "react-toastify";
import {updateBron} from "../http/bronAPI";


const BronCollection= observer(({select=false}) => {
    const notify = (msg) => toast.success(msg );
    const notifyer = (msg) => toast.error(msg );
    const {bron} = useContext(Context)
    async function clickcanselandex(id,metod,kode){
        let bronn;
        try {
            bronn = await updateBron(id,metod,kode)
            if (bronn.isCode === 200) {
                notify('Данные сохранены',bronn.isCode)
                bron.setTriger(!bron.getTriger)
            }
            if (bronn.isCode !== 200) {
                notifyer(bronn.getmsg,bronn.isCode)
            }
        } catch (e) {
            notifyer(e?.response?.data?.message,bronn.isCode)
        }
    }
    return (

        <> <ToastContainer />
            {bron?.getBron?.map(bronn =>
                <BronItem Sel={select} key={bronn.id_bron} clickcanselandex={clickcanselandex} bronn={bronn}/>
            )}
        </>
    );
});


export default BronCollection;