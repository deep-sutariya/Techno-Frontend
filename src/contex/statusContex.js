import { useState } from "react";
import { createContext } from "react";

export const StatusDetail = createContext(null);

export const StatusDetailProvider = (props) =>{

    const [inSameArea, setInSameArea] = useState({status:false,address:''});
    const [locationList, setLocationList] = useState([]);

    const statusvalue = {inSameArea, setInSameArea, locationList, setLocationList}

    return(
        <StatusDetail.Provider value={statusvalue}>{props.children}</StatusDetail.Provider>
    )
}