import React from 'react'
import { View, Text } from 'react-native';

export default function CameraScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text  style={{ color: '#lightgray', fontWeight: "bold", fontSize: 24 }}
                >
                    Camera Screen
            </Text>
        </View>
    );
}