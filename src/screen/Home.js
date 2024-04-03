import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { getLocation } from '../utils/getLocation';
import { isInArea } from '../utils/isInArea';
import checkLocation from '../utils/checkLocation';

const Home = () => {
    const [inSameArea, setInSameArea] = useState(false);

    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);

    const [location, setLocation] = useState("");
    const [fetchlocation, setFetchlocation] = useState([]);

    let loc = getLocation();

    const [userLocations, setUserLocations] = useState([]);
    const [locationList, setLocationList] = useState([]);

    const fetchData = async () => {
        if (loc.lat && loc.lon) {
            try {
                const data = await isInArea(loc);
                setUserLocations(data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }
    };

    const fetchLocation = async () => {
        try {
            const res = await axios.post("http://192.168.104.115:5000/getlocationlist");
            setLocationList(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    const checkLocationAndUpdate = () => {
        fetchData();
        fetchLocation();
    };

    useEffect(() => {
        const intervalId = setInterval(checkLocationAndUpdate, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setInSameArea(checkLocation(userLocations, locationList));
        console.log("U-->",userLocations);
    }, [userLocations, locationList]);




    const handleFetch = async () => {
        if (location.length > 1) {
            try {
                setFetchlocation([])
                setLoading(true);
                const data = await axios.get(`https://trueway-geocoding.p.rapidapi.com/Geocode?language=en&address=${location}`, {
                    headers: {
                        'X-RapidAPI-Key': '1aecf3ac76mshe524bcc63f5c710p10f501jsn24c678f969cb',
                        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
                    }
                })
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
            const res = await axios.post("http://192.168.104.115:5000/addlocation", fetchlocation);
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

    return (
        <ScrollView>

            <View className="flex gap-6 justify-center items-center ">
                {
                    inSameArea ?
                        <Text className="text-xl font-bold text-red-800">Yore into same area</Text> : <></>
                }
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

                <View className=' max-h-[45vh] w-full flex-col justify-center items-center bg-zinc-300'>
                    <Text className="text-2xl font-bold text-gray-800 pt-7">Location List</Text>
                    <ScrollView className='w-full mt-10'>
                        <View className="flex-col items-center self-stretch justify-center gap-3 mb-4 px-1">
                            {Object.keys(locationList).length > 0 ?
                                Object.keys(locationList).map((val, index) => {
                                    return <Text key={index} className={`text-base text-justify p-2 font-bold text-gray-800 border-b border-dashed `}>{locationList[val].address}</Text>
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