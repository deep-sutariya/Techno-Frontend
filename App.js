import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';

import 'react-native-gesture-handler';
import { StatusDetailProvider } from './src/contex/statusContex';

export default function App() {
  return (
    <StatusDetailProvider>

      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#424769"
          translucent={true}
        />
        <AppNavigator />

      </NavigationContainer>

    </StatusDetailProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});