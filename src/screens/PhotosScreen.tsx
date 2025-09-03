import React from 'react'
import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import PhotoModal from '../components/PhotoModal';
import { Photo } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


export default function PhotosScreen() {
    const photos = useSelector((state: RootState) => state.photos.list);
    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                {photos.map((photo: Photo) => (
                <TouchableOpacity key={photo.id}>
                    <Image
                    source={{ uri: photo.uri }}
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                    />
                </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
