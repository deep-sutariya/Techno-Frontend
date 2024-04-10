import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Button } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

import checkLocation from '../utils/checkLocation';

import { StatusDetail } from '../contex/statusContex';
import getLocation from '../utils/getLocation';

import { registerForPushNotificationsAsync, setupNotifications } from '../utils/sendNotification';
import LocationCard from '../component/LocationListCard';
import checkExpireNotification from '../utils/checkExpireNotification';
import LoadingSpinner from '../component/LoadingSpinner';

// import BackgroundTimer from 'react-native-background-timer';

setupNotifications();

const Home = () => {
    const { inSameArea, setInSameArea, locationList, setLocationList, loc, setLoc } = useContext(StatusDetail);

    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [flag, setFlag] = useState(false);

    const [location, setLocation] = useState("");
    const [fetchlocation, setFetchlocation] = useState([]);

    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
        });
        fetchLocation();
        const intervalId = setInterval(() => {
            getLocation().then((newLoc) => setLoc(newLoc))
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    // useEffect(() => {
    //     BackgroundTimer.runBackgroundTimer(() => {
    //         console.log("BG Process");
    //         getLocation().then((newLoc) => setLoc(newLoc));
    //     }, 10000); 

    //     return () => {
    //         BackgroundTimer.stopBackgroundTimer();
    //     };
    // }, []);

    const sendNoti = async (title, tasks, id) => {
        try {
            const ack = await axios.post(`${process.env['API_BASE_URL']}/sendnotification`, { title, tasks, id, token:expoPushToken });
            if (ack?.data?.data?.data?.status == "ok") {
                fetchLocation();
            };
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(() => {
        if (inSameArea?.data?._id != undefined && inSameArea?.status && loc != null) {
            if (checkExpireNotification(inSameArea?.data?.lastNotificationSentAt)) {
                let tasks = inSameArea?.data?.tasks.map(task => task.title).join('\n');
                if (tasks.length > 0 && expoPushToken.length>0) {
                    sendNoti(inSameArea?.data?.address, tasks, inSameArea?.data?._id);
                }
            }
        }
    }, [inSameArea, loc])

    // useEffect(() => {
    //     BackgroundTimer.runBackgroundTimer(() => {
    //         if (inSameArea?.data?._id != undefined && inSameArea?.status && loc != null) {
    //             if (checkExpireNotification(inSameArea?.data?.lastNotificationSentAt)) {
    //                 let tasks = inSameArea?.data?.tasks.map(task => task.title).join('\n');
    //                 sendNoti(inSameArea?.data?.address, tasks, inSameArea?.data?._id);
    //             }
    //         }
    //     }, 60000);

    //     return () => {
    //         BackgroundTimer.stopBackgroundTimer();
    //     };
    // }, [inSameArea, loc]);



    // ------------------------------------------

    const fetchLocation = async () => {
        try {
            setLoadingList(true);
            const res = await axios.post(`${process.env['API_BASE_URL']}/getlocationlist`);
            setLocationList(res?.data?.data);
            setLoadingList(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        let data = checkLocation(loc, locationList)
        if (JSON.stringify(inSameArea) !== JSON.stringify(data)) {
            setInSameArea(data);
        }
    }, [loc, locationList]);


    const handleFetch = async () => {
        if (location.length > 1) {
            try {
                setFetchlocation([])
                setLoading(true);
                const data = await axios.post(`${process.env['API_BASE_URL']}/fetchlocation`, { location });
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
            const res = await axios.post(`${process.env['API_BASE_URL']}/addlocation`, fetchlocation);
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
            const res = await axios.post(`${process.env['API_BASE_URL']}/deletelocation`, { _id: id });
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

            <View className="flex mt-4 justify-center items-center ">

                <View className="flex-row pt-16 items-center self-stretch justify-center gap-3 mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Add Locations</Text>
                </View>

                <View className="w-4/5 pb-10">
                    <TextInput
                        className="p-3 min-w-full bg-offwhite rounded-lg  border border-black text-xl"
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
                            <TouchableOpacity className="bg-dark p-3 rounded-lg items-center bg-hover" onPress={handleAdd}>
                                <Text className="text-white text-lg font-bold">
                                    {
                                        loading ? <LoadingSpinner color="#fff" size="small" /> : "Add"
                                    }
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className="bg-dark p-3 rounded-lg items-center bg-hover" onPress={handleFetch}>
                                <Text className="text-white text-lg font-bold">
                                    {
                                        loading ? <LoadingSpinner color="#fff" size="small" /> : "Fetch"
                                    }
                                </Text>
                            </TouchableOpacity>
                    }
                </View>

                <View className=' w-full flex-1 flex-col justify-center items-center bg-zinc-300 min-h-[58vh]'>
                    <Text className="text-2xl font-bold text-gray-800 pt-7">Location List</Text>
                    <ScrollView className='w-full mt-10'>
                        {/* {
                            loadingList ? <LoadingSpinner color="#7077A1" /> : */}
                        <View className="flex-col items-center w-full justify-center">
                            {Object.keys(locationList).length > 0 ?
                                Object.keys(locationList).map((val, index) => {
                                    return <LocationCard key={index} location={locationList[val]} confirmShow={confirmShow} fetchLocation={fetchLocation} />

                                    // return <View key={index} className="flex-row w-[85%] items-center justify-between p-2 border-b border-dashed">
                                    //     <Text key={index} className="text-base w-[85%] text-justify self-start font-bold text-gray-800">
                                    //         {locationList[val].address}
                                    //     </Text>
                                    //     
                                    // </View>
                                })
                                : <Text>No Data Available</Text>
                            }
                        </View>
                        {/* } */}
                    </ScrollView>
                </View>

            </View >
        </ScrollView>
    );
};

export default Home