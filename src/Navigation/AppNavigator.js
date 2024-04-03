import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/Home';
import Notificaton from '../screen/Notification';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={Home} options={{title: 'Locations'}} />
      <Stack.Screen name="notificaton" component={Notificaton} />
    </Stack.Navigator>
  )
}

export default AppNavigator