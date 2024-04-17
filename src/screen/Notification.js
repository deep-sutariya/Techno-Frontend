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

    const { inSameArea, setInSameArea, locationList, setLocationList, loc, setLoc } = useContext(StatusDetail);

    const navigation = useNavigation();

    const fetchLocation = async () => {
        try {
            const res = await axios.post(`${process.env['API_BASE_URL']}/getlocationlist`);
            setLocationList(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getLocation().then((newLoc) => setLoc(newLoc))
        fetchLocation();
    }, []);

    useEffect(() => {
        const val = checkLocation(loc, locationList);
        setInSameArea(val);
    }, [loc, locationList]);

    return (
        <View className='w-full flex-col justify-center gap-y-28'>
            <View className="flex h-[50%] justify-center items-center">
                {
                    inSameArea?.status ?
                        <View className="flex-col justify-center items-center gap-y-16 mt-10">
                            <Text className="text-xl font-bold text-slate-500 px-5">At area which is in the list</Text>
                            <View className="flex-col items-center gap-y-3 max-w-[85%]">
                                <Text className="text-base text-justify font-bold text-slate-500">Address:</Text>
                                <Text className="text-sm text-justify font-bold text-slate-500">{inSameArea?.data?.address}</Text>
                            </View>
                        </View>
                        :
                        <View className=" flex justify-center items-center mt-16">
                            <Text className="text-lg px-3 font-bold text-slate-500">Not at any location from Location List</Text>
                            <Text className="text-lg px-3 font-bold text-slate-500 mt-20">Latitute: {JSON.stringify(loc?.lat)}</Text>
                            <Text className="text-lg px-3 font-bold text-slate-500">Longitute: {JSON.stringify(loc?.lon)}</Text>
                        </View>
                }
            </View>
            <View>
                <TouchableOpacity className=" bg-[#7077A1] w-2/3 rounded-lg mx-auto py-2 px-1" onPress={() => navigation.navigate('Home')}>
                    <Text className=" font-bold text-lg text-white mx-auto">Locations</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Notification