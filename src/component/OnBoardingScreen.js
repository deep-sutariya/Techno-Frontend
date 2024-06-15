import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const OnBoardingScreen = () => {
    const navigation = useNavigation();
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, opacityAnim]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigation.navigate('Drawer');
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <View className="flex-column gap-y-14 justify-center items-center h-24 mt-10 mb-5  border-b-2 border-slate-500">
                <Animated.View
                    style={{
                        width: 250,
                        height: 80,
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        transform: [{ scale: scaleAnim }]
                    }}
                >
                    <Image
                        style={{ width: 250, height: 80 }}
                        source={require('../../assets/logo.png')}
                    />
                </Animated.View>
                <Animated.Text
                    style={[
                        "text-2xl font-semibold mb-10 text-hover",
                        { opacity: opacityAnim }
                    ]}
                >
                    Task Management Based on Location!
                </Animated.Text>
            </View>
            <View className="mt-52">
                <TouchableOpacity
                    onPress={() => navigation.navigate("Drawer")}
                    className=" bg-hover px-5 py-2 rounded-lg flex flex-row items-center"
                >
                    <Text className="text-white text-lg font-semibold mr-2">Visit</Text>
                    <Ionicons name="enter-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnBoardingScreen;
