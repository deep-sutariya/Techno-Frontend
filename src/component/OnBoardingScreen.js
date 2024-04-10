import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
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
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-white gap-y-10">
            <Animated.Text
                style={{
                    fontSize: 40,
                    color: "red",
                    marginBottom: 5,
                    textAlign: "center",
                    fontWeight: "bold",
                    letterSpacing: 1,
                    transform: [{ scale: scaleAnim }]
                }}
            >
                yaDoo
            </Animated.Text>
            <Animated.Text
                style={[
                    "text-gray-800 text-lg font-semibold mb-10",
                    { opacity: opacityAnim }
                ]}
            >
                Welcome to our App ❤️!
            </Animated.Text>
            <TouchableOpacity
                onPress={() => navigation.navigate("Drawer")}
                className="bg-darkslateblue px-6 py-3 rounded-full flex flex-row items-center"
            >
                <Text className="text-white text-lg font-semibold mr-2">Visit</Text>
                <Ionicons name="enter-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default OnBoardingScreen;
