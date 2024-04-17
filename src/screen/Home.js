import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Button } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';

import checkLocation from '../utils/checkLocation';

import { StatusDetail } from '../contex/statusContex';
import getLocation from '../utils/getLocation';

import { registerForPushNotificationsAsync, setupNotifications } from '../utils/sendNotification';
import LocationCard from '../component/LocationListCard';
import checkExpireNotification from '../utils/checkExpireNotification';
import LoadingSpinner from '../component/LoadingSpinner';

setupNotifications();

import * as Location from 'expo-location';
const LOCATION_TASK_NAME = "background-location-task";
const requestPermissions = async () => {
    const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 10000,
                foregroundService: {
                    killServiceOnDestroy: false,
                    notificationTitle: "Fetching In Background",
                    notificationBody: "You can turn off by open application",
                },
            });
        }
    }
};

const Home = () => {
    const { inSameArea, setInSameArea, locationList, setLocationList, loc, setLoc } = useContext(StatusDetail);

    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [flag, setFlag] = useState(false);

    const [location, setLocation] = useState("");
    const [fetchlocation, setFetchlocation] = useState([]);

    const [expoPushToken, setExpoPushToken] = useState('');


    TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
        console.log('--?Background');
        if (error) {
            return;
        }
        if (data) {
            const { locations } = data;
            let currentLocation = { lat: locations[0].coords.latitude, lon: locations[0].coords.longitude };
            console.log(currentLocation);
            setLoc(currentLocation);
            if (inSameArea?.data?._id && inSameArea?.status && currentLocation) {
                let tasks = inSameArea?.data?.tasks.map(task => task.title).join('\n');
                if (tasks.length > 0 && expoPushToken.length > 0) {
                    sendNoti(inSameArea?.data?.address, tasks, inSameArea?.data?._id);
                }
            }

        }
    });

    useEffect(() => {
        requestPermissions();
        registerForPushNotificationsAsync().then(token => {
            console.log("T->", token);
            setExpoPushToken(token)
        });
        fetchLocation();
        const intervalId = setInterval(() => {
            getLocation().then((newLoc) => setLoc(newLoc))
        }, 10000);
        (async () => {
            await BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
                minimumInterval: 10,
                stopOnTerminate: false,
                startOnBoot: true,
            });
        })();

        return () => clearInterval(intervalId);
    }, []);


    const sendNoti = async (title, tasks, id) => {
        console.log("Notification Funs");
        if (!title || !tasks || !id || !expoPushToken) {
            console.error("Required parameters are missing.");
            return;
        }

        if (checkExpireNotification(inSameArea?.data?.lastNotificationSentAt)) {
            // console.log("Notification is not expired. Skipping notification.");
            return;
        }

        const notificationData = {
            title,
            tasks,
            id,
            token: expoPushToken
        };

        try {
            const ack = await axios.post(`${process.env['API_BASE_URL']}/sendnotification`, notificationData);
            // const ack = await axios.post(`http://192.168.2.197:5000/sendnotification`, notificationData);
            if (ack?.data?.data?.status === "ok") {
                const currentTime = new Date().toISOString();
                console.log("Time-->", currentTime);
                setInSameArea(prevState => ({
                    ...prevState,
                    data: {
                        ...prevState.data,
                        lastNotificationSentAt: currentTime
                    }
                }));
                fetchLocation();
            }
        } catch (e) {
            console.log("Error sending notification:", e);
        }
    };

    useEffect(() => {
        if (inSameArea?.data?._id != undefined && inSameArea?.status && loc != null) {
            let tasks = inSameArea?.data?.tasks.map(task => task.title).join('\n');
            if (tasks.length > 0 && expoPushToken.length > 0) {
                sendNoti(inSameArea?.data?.address, tasks, inSameArea?.data?._id);
            }
        }
    }, [inSameArea, loc])



    // ------------------------------------------

    const fetchLocation = async () => {
        try {
            loadingFirst ? setLoadingList(true) : setLoadingList(false);
            const res = await axios.post(`${process.env['API_BASE_URL']}/getlocationlist`);
            setLocationList(res?.data?.data);
            setLoadingList(false);
            setLoadingFirst(false);
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

    useEffect(() => {
        if (location.length < 3) setFetchlocation([])
    }, [location])


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
        // <ScrollView>

        <View className="flex-col mt-4 justify-center items-center h-full ">

            <View className="w-4/5 pb-10">
                <View className="flex-row pt-6 items-center self-stretch justify-center gap-3 mb-4">
                    <Text className="text-xl font-bold text-gray-800">Add Locations</Text>
                </View>
                <TextInput
                    className={`px-3 py-2 min-w-full bg-offwhite ${fetchlocation.length > 0 ? " rounded-t-lg" : "rounded-lg"} border border-black text-xl`}
                    placeholder="location"
                    id='location'
                    value={location}
                    onChangeText={(text) => {
                        if (flag) setFlag(false)
                        setLocation(text);
                    }}
                    autoCapitalize="none"
                />
                <ScrollView className="max-h-[25vh] mb-5">
                    {
                        fetchlocation.length > 0 &&
                        <View className=" bg-gray-400 flex-col rounded-b-xl py-1 px-2">
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
                        <TouchableOpacity className="bg-dark p-2 rounded-lg items-center bg-hover" onPress={handleAdd}>
                            <Text className="text-white text-lg font-bold">
                                {
                                    loading ? <LoadingSpinner color="#fff" size="small" /> : "Add"
                                }
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity className="bg-dark p-2 rounded-lg items-center bg-hover" onPress={handleFetch}>
                            <Text className="text-white text-lg font-bold">
                                {
                                    loading ? <LoadingSpinner color="#fff" size="small" /> : "Fetch"
                                }
                            </Text>
                        </TouchableOpacity>
                }
            </View>

            <View className=' w-full flex-1 flex-col justify-center items-center bg-zinc-300'>
                <Text className="text-xl font-bold text-gray-800 py-5">Location List</Text>
                <ScrollView className='w-full flex-1 mb-5'>
                    {
                        loadingList ? <LoadingSpinner color="#7077A1" size="medium" /> :
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
                    }
                </ScrollView>
            </View>

        </View >
        // </ScrollView>
    );
};

export default Home