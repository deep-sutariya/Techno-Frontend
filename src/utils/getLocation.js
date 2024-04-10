import React,{ useEffect, useState } from 'react';
import * as Location from 'expo-location';

const getLocation = async () => {
    // const [currentLocation, setCurrentLocation] = useState(null);
    let currentLocation;
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return;
    }
    let location = await Location.getCurrentPositionAsync({});
    currentLocation = {lat:location?.coords?.latitude, lon:location?.coords?.longitude};
    return currentLocation;
};

export default getLocation;
