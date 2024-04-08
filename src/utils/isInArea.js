import axios from 'axios';

const isInArea = async(loc) => {
    let data;
    try {
        data = await axios.post(`http://192.168.2.194:5000/fetchlocationname`, {loc});
    } catch (e) {
        console.log("ErrF==>",e);
    }
    return data?.data;
};

export { isInArea };