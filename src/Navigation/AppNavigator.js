import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/Home';
import Notificaton from '../screen/Notification';
import DrawerNavigator from './DrawerNavigator';
import Login from '../screen/Login';
import Signup from '../screen/Signup';
import OnBoardingScreen from '../component/OnBoardingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    <Stack.Navigator initialRouteName="onBoarding">
      <Stack.Screen name="onBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Home"
        options={{
          title: 'Locations',
          headerStyle: {
            backgroundColor: '#64748B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: "#fff"
          },
        }}>
        {(props) => <Home {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Notification"
        options={{
          title: 'Status',
          headerStyle: {
            backgroundColor: '#64748B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: "#fff"
          },
        }}>
        {(props) => <Notificaton {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Login"
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: '#64748B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: "#fff"
          },
        }}>
        {(props) => <Login {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Signup"
        options={{
          title: 'Signup',
          headerStyle: {
            backgroundColor: '#64748B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: "#fff"
          },
        }}>
        {(props) => <Signup {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  )
}

export default AppNavigator