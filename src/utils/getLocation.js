import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const getLocation = () => {
    const [loc, setLoc] = useState({lat:"", lon:""}); 

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("Location Not Granted");
            }
            let location = await Location.getCurrentPositionAsync({});
            setLoc({lat: location?.coords?.latitude, lon: location?.coords?.longitude});
        })();
    }, []);

    return loc;

};

export { getLocation };