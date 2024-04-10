import { useState } from "react";
import { createContext } from "react";

export const StatusDetail = createContext(null);

export const StatusDetailProvider = (props) =>{

    const [inSameArea, setInSameArea] = useState({status:false,address:''});
    const [locationList, setLocationList] = useState([]);
    const [loc, setLoc] = useState(null);

    const statusvalue = {loc, setLoc, inSameArea, setInSameArea, locationList, setLocationList}

    return(
        <StatusDetail.Provider value={statusvalue}>{props.children}</StatusDetail.Provider>
    )
}