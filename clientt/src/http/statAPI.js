import {$authHost} from "./index";
import Elem_Stat_Stat from "../store/Elem_Stat_Stat";
const EX=new Elem_Stat_Stat(null,{},"")

export const fetchStat = async (date_start,date_end) => {
    await $authHost.get('api/statistic',{params: {date_start, date_end}}).then((data)=>{
        const {status,statusText}=data
        EX.setStat(data?.data)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })
    return EX
}