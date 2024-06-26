import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const LoadingSpinner = ({color, size}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export default LoadingSpinner;