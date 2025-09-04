import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Photo } from "../types/photosTypes";

type PhotoModalProps = {
    selectedPhoto: Photo | null;
    setSelectedPhoto: (photo: Photo | null) => void;
    formatter: Intl.DateTimeFormat;
    };

export default function PhotoModal({ selectedPhoto, setSelectedPhoto, formatter }: PhotoModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  // Gérer le swipe vertical
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10, // commence si mouvement vertical
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy); // on suit le doigt vers le bas
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // si swipe assez long → fermer
          setSelectedPhoto(null);
        } else {
          // sinon → revenir en place
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={!!selectedPhoto}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedPhoto(null)}
    >
      {/* Overlay (clic hors modal) */}
      <Pressable
        style={styles.modalContainer}
        onPress={() => setSelectedPhoto(null)}
      >
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          {selectedPhoto?.uri ? (
            <Image source={{ uri: selectedPhoto.uri }} style={styles.image} />
          ) : (
            <Text>No image available</Text>
          )}

          <Text style={styles.date}>
            <FontAwesome name="calendar" size={20} color="#e11d48" />{" "}
            {formatter.format(
              new Date(
                selectedPhoto?.capturedAt ||
                  Date.now()
              )
            )}
          </Text>

          {selectedPhoto?.notes ? (
            <Text style={{ marginBottom: 10 }}>
              <FontAwesome name="info-circle" size={20} color="#e11d48" />{" "}
              {selectedPhoto.notes}
            </Text>
          ) : null}

          <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Text style={{ color: "white" }}>Fermer</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: 280,
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
