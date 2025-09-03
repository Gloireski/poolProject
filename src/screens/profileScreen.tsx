import React from 'react'
import { View, Text } from 'react-native'

export default function ProfileScreen() {
    return (
        <View className="flex-1 items-center justify-center" 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text
                style={{ color: '#lightgray', fontWeight: "bold", fontSize: 24 }}>
                Profile
            </Text>
        </View>
    );
}
