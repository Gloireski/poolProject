import React, { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import  { RootState } from "../redux/store";
import { Photo } from "../types/index";
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import Modal from 'react-native-modal';
import { Modal } from "react-native";
import PhotoModal from "../components/PhotoModal";

export default function MapScreen() {
    const photos = useSelector((state: RootState) => state.photos.list);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [isVisible, setIsVisible] = useState(true); 
    // console.log("📷 Photos Redux:", photos);


    return (
        <View style={{ flex: 1 }}>
    
            <MapView
                style={{ flex: 3 }}
                initialRegion={{
                    latitude: photos.length ? photos[0]?.location?.latitude ?? 48.8566 : 48.8566,
                    longitude: photos.length ? photos[0]?.location?.longitude ?? 2.3522 : 2.3522,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                >
                {photos.map((photo) => (
                    <Marker
                        key={photo.id}
                        coordinate={photo.location!}
                        title={photo.date}
                        onPress={() => setSelectedPhoto(photo)}
                        // image={{uri: photo.uri}}
                        // anchor={{ x: 0.5, y: 0.5 }}
                    >
                        {/* <View style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", borderWidth: 2, borderColor: "white" }}>
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: 80, height: 80 }}
                        />
                        </View> */}
                    </Marker>
                    ))}

            </MapView>
   
            {/* Modal de react-native pour afficher la photo */}
            <Modal 
                visible={!!selectedPhoto} transparent animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPhoto?.uri ? (
                            <Image source={{ uri: selectedPhoto.uri }} style={styles.image} />
                        ) : (
                            <Text>No image available</Text>
                        )}
                        <Text style={styles.date}>
                            <FontAwesome name="calendar" size={24} color="red" /> {selectedPhoto?.date}
                        </Text>
                        {
                            selectedPhoto?.description?(
                                <Text style={{ marginBottom: 10 }}>
                                    <FontAwesome name="info-circle" size={24} color="red" /> {selectedPhoto?.description}
                                </Text>
                            ): ""
                        }
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setSelectedPhoto(null)}
                        >
                            <Text style={{ color: "white" }}>Fermer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            {/* Modal de react-native-modal pour afficher la photo */}
            {/* <PhotoModal
                selectedPhoto={selectedPhoto}
                onClose={() => setSelectedPhoto(null)}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end", // affichage en bas
        margin: 0,
    },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
});
