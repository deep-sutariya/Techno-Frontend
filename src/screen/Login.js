import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import axios from 'axios';
import { EmailValidator } from "../utils/inputValidation";


const Login = ({ navigation, setUserData }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        if(email){
            if(EmailValidator(email)){
                if(password){
                    setEmail("");
                    setPassword("");
                    setMessage("");
                    alert("Login Success!")
                }
                else{
                    setMessage("Enter Password");
                }
            }
            else{
                setMessage("Enter Valid Email");
            }
        }
        else{
            setMessage("Enter Email");
        }
    }

    return (
        <View className="flex-1 gap-6 justify-center items-center ">

            <View className="flex-row items-center self-stretch justify-center gap-x-3 mb-4 py-2">
                <Text className="text-4xl font-bold text-gray-800">Login</Text>
                <FontAwesome5 name="user-lock" size={24} color="black" className="animate-spin" />
            </View>

            <View className="w-4/5">
                <TextInput
                    className="p-3 bg-gray-200 rounded-lg mb-4"
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        // setMessage("");
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className=" bg-gray-200 p-3 rounded-lg mb-4"
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        // setMessage("");
                    }}
                    secureTextEntry={true}
                />

                {
                    message ?
                        <Text className="mb-2 text-red-500">{message}</Text>
                        : <></>
                }
            </View>


            <TouchableOpacity className=" bg-hover p-3 rounded-lg flex-row gap-x-2 items-center justify-center w-4/5" onPress={handleLogin} >
                <Text className="text-white text-lg font-bold">
                    Login
                </Text>
                <Entypo name="login" size={20} color="white" />
            </TouchableOpacity>

        </View>
    )
}

export default Login