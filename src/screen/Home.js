import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Button } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

import checkLocation from '../utils/checkLocation';

import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusDetail } from '../contex/statusContex';
import getLocation from '../utils/getLocation';

import { registerForPushNotificationsAsync, setupNotifications } from '../utils/sendNotification';
import isNotificationExpired from '../utils/checkNotiExpire';


const Home = () => {
    const { inSameArea, setInSameArea, locationList, setLocationList } = useContext(StatusDetail);

    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
        });
        fetchLocation();
    }, []);

    useEffect(()=>{
        console.log(expoPushToken);
    },[expoPushToken])

    const sendNoti = async (title,body,id) => {
        const ack = await axios.post("http://192.168.2.195:5000/sendnotification", {title,body,id});
    }

    useEffect(() => {
        console.log(inSameArea);
        if (inSameArea?.data?._id!=undefined && inSameArea?.status && loc!=null) {
            console.log("Id-->",inSameArea?.data?._id);
            sendNoti(inSameArea?.data?.address,"Task1, Task2, Task3",inSameArea?.data?._id);
        }
    }, [inSameArea])


    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);

    const [location, setLocation] = useState("");
    const [fetchlocation, setFetchlocation] = useState([]);

    const [loc, setLoc] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getLocation().then((newLoc)=>setLoc(newLoc))
        }, 5000);
        
        return () => clearInterval(intervalId);
    },[]);

    useEffect(() => {
        console.log("Location:", loc);
    }, [loc]);



    // ------------------------------------------

    const fetchLocation = async () => {
        try {
            const res = await axios.post("http://192.168.2.195:5000/getlocationlist");
            setLocationList(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    // useEffect(() => {
    //     fetchLocation();
    // }, []);

    useEffect(() => {
        let data = checkLocation(loc, locationList)
        if(JSON.stringify(inSameArea) !== JSON.stringify(data)){
            setInSameArea(data);
        }
    }, [loc, locationList]);


    const handleFetch = async () => {
        if (location.length > 1) {
            try {
                setFetchlocation([])
                setLoading(true);
                const data = await axios.post(`http://192.168.2.195:5000/fetchlocation`, { location });
                const info = Object.keys(data?.data?.results).map((val) => {
                    return data?.data?.results[val];
                });
                setFetchlocation(info);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleAdd = async () => {
        try {
            const res = await axios.post("http://192.168.2.195:5000/addlocation", fetchlocation);
            if (res?.status === 500) {
                alert(res?.data?.message)
            }
            else {
                alert(res?.data?.message)
                setFlag(false)
                setFetchlocation([]);
                setLocation("");
                fetchLocation();
            }
        } catch (e) {
            console.log(e);
        }
    }

    const confirmShow = (id) => {
        Alert.alert(
            'Delete Location',
            'Are you sure you want to delete this location?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => deleteLocation(id)
                }
            ]
        )
    }
    const deleteLocation = async (id) => {
        try {
            const res = await axios.post("http://192.168.2.195:5000/deletelocation", { _id: id });
            if (res?.status === 200) {
                alert(res?.data?.message)
                setFetchlocation([]);
                fetchLocation();
            }
            else {
                alert(`${res?.data?.data} + ${res?.data?.message}`)
            }
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <ScrollView>

            <View className="flex my-4 justify-center items-center ">
                <Button
                    title="Press to schedule a notification"
                    onPress={sendNoti}
                />

                <View className="flex-row pt-16 items-center self-stretch justify-center gap-3 mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Add Locations</Text>
                </View>

                <View className="w-4/5 pb-10">
                    <TextInput
                        className="p-3 min-w-full bg-offwhite rounded-lg mb-4 border border-black text-xl"
                        placeholder="location"
                        id='location'
                        value={location}
                        onChangeText={(text) => {
                            if (flag) setFlag(false)
                            setLocation(text);
                        }}
                        autoCapitalize="none"
                    />
                    <ScrollView className="max-h-[20vh] mb-5">
                        {
                            fetchlocation.length > 0 &&
                            <View className=" bg-gray-500 flex-col rounded-b-xl py-2 px-2">
                                {Object.keys(fetchlocation).length > 0 ?
                                    Object.keys(fetchlocation).map((val, index) => {
                                        return <TouchableOpacity key={index} className={`${index != fetchlocation.length - 1 ? ' border-b border-dashed' : ''}`}
                                            onPress={() => {
                                                setLocation(fetchlocation[index].address);
                                                setFlag(true);
                                            }} >
                                            <Text className='text-base text-white py-2'>{fetchlocation[val].address}</Text>
                                        </TouchableOpacity>
                                    })
                                    : <></>
                                }
                            </View>
                        }
                    </ScrollView>

                    {
                        flag ?
                            <TouchableOpacity className="bg-dark p-3 rounded-lg items-center bg-slate-500" onPress={handleAdd}>
                                <Text className="text-white text-lg font-bold">
                                    {
                                        loading ? "Loading..." : "Add"
                                    }
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className="bg-dark p-3 rounded-lg items-center bg-slate-500" onPress={handleFetch}>
                                <Text className="text-white text-lg font-bold">
                                    {
                                        loading ? "Loading..." : "Fetch"
                                    }
                                </Text>
                            </TouchableOpacity>
                    }
                </View>

                <View className='h-[55vh] w-full flex-col justify-center items-center bg-zinc-300'>
                    <Text className="text-2xl font-bold text-gray-800 pt-7">Location List</Text>
                    <ScrollView className='w-full mt-10'>
                        <View className="flex-col items-center self-stretch justify-center gap-3 mb-4 px-1">
                            {Object.keys(locationList).length > 0 ?
                                Object.keys(locationList).map((val, index) => {
                                    return <View key={index} className="flex-row w-[85%] items-center justify-between p-2 border-b border-dashed">
                                        <Text key={index} className="text-base w-[85%] text-justify self-start font-bold text-gray-800">
                                            {locationList[val].address}
                                        </Text>
                                        <TouchableOpacity onPress={() => confirmShow(locationList[val]._id)}><AntDesign name="delete" size={20} color="red" /></TouchableOpacity>
                                    </View>

                                })
                                : <Text>No Data Available</Text>
                            }
                        </View>
                    </ScrollView>
                </View>

            </View >
        </ScrollView>
    );
};

export default Home