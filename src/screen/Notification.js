import React, { useContext, useState } from 'react'
import { View, Button, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { StatusDetail } from '../contex/statusContex';
import { useEffect } from 'react';
import checkLocation from '../utils/checkLocation';

import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import getLocation from '../utils/getLocation';

const Notification = () => {

    const { inSameArea, setInSameArea, locationList, setLocationList } = useContext(StatusDetail);

    const navigation = useNavigation();

    const [loc, setLoc] = useState({});

    const fetchLocation = async () => {
        try {
            const res = await axios.post("http://192.168.2.195:5000/getlocationlist");
            setLocationList(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getLocation().then((newLoc) => setLoc(newLoc));
        fetchLocation();
    }, []);

    useEffect(() => {
        console.log("LLLLL",loc);
    }, [loc]);

    useEffect(() => {
        const val = checkLocation(loc, locationList);
        setInSameArea(val);
    }, [loc, locationList]);

    return (
        <View className='w-full flex-col justify-center gap-y-28'>
            <View className="flex h-[50%] justify-center items-center ">
                {
                    inSameArea?.status ?
                        <View className="flex-col justify-center items-center gap-y-16 mt-10">
                            <Text className="text-xl font-bold text-red-800">Yore into same area</Text>
                            <View className="flex-col items-center gap-y-3 max-w-[85%]">
                                <Text className="text-base text-justify font-bold text-red-800">Address:</Text>
                                <Text className="text-sm text-justify font-bold text-red-800">{inSameArea?.data?.address}</Text>
                            </View>
                        </View>
                        :
                        <Text className="text-xl font-bold text-red-800">Yore Not at any location </Text>
                }
            </View>
            <TouchableOpacity className=" bg-slate-500 w-2/3 rounded-lg mx-auto py-2 px-1" onPress={() => navigation.navigate('Home')}>
                <Text className=" font-bold text-lg text-white mx-auto">Locations</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Notification