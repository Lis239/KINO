import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import BiletItem from "./Bilet_Item";


const BiletCollection = observer(() => {
    const {bilet} = useContext(Context)
    return (
        <>
            {bilet?.getBilet?.map(bile =>
                <BiletItem key={bile.id_bilet} max={bilet.get_maxcoll} bilet={bile}/>
            )}
        </>
    );
});

export default BiletCollection;