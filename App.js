import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-native';
import axios from 'axios';

import 'react-native-gesture-handler';
import { StatusDetailProvider } from './src/contex/statusContex';


export default function App() {

  return (
    <StatusDetailProvider>

      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#64748B"
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

