import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import Notification from "../screen/Notification";
import Home from "../screen/Home";
import CustomDrawer from "./CustomDrawer";

import { Zocial } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import Login from "../screen/Login";
import Signup from "../screen/Signup";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="Status"
      drawerContent={(props) => (
        <CustomDrawer
          {...props}
        />
      )}
      screenOptions={{
        drawerAllowFontScaling: true,
        drawerActiveBackgroundColor: "#64748B",
        drawerActiveTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#64748B",
        },
        headerTitleStyle: {color: 'white', marginLeft:10},
        drawerLabelStyle:{marginLeft: -15, fontSize:15},
        headerLeft: () => (
          <TouchableOpacity className=" ml-5"  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>
        ),
      }}

    >

      <Drawer.Screen name="Status"
        options={{
          drawerIcon: () => <Zocial name="statusnet" size={20} color="black" /> 
        }}
      >
        {(props) => <Notification navigation={navigation} />}
      </Drawer.Screen>

      <Drawer.Screen name="Locations"
        options={{
          drawerIcon: () => <FontAwesome6 name="location-pin-lock" size={20} color="#313639" />
        }}
      >
        {(props) => <Home navigation={navigation} />}
      </Drawer.Screen>

      <Drawer.Screen name="Login"
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="login-variant" size={20} color="black" />
        }}
      >
        {(props) => <Login navigation={navigation} />}
      </Drawer.Screen>

      <Drawer.Screen name="Signup"
        options={{
          drawerIcon: () => <Feather name="user-plus" size={20} color="black" />
        }}
      >
        {(props) => <Signup navigation={navigation} />}
      </Drawer.Screen>

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;