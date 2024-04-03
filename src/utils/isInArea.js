import axios from 'axios';

const isInArea = async(loc) => {
    let data;
    try {
        data = await axios.post(`http://192.168.104.115:5000/fetchlocationname`, {loc});
    } catch (e) {
        console.log("ErrF==>",e);
    }
    return data?.data;
};

export { isInArea };