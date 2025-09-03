import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Modal } from "react-native";
import { Photo } from "../types";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  selectedPhoto: Photo | null;
  onClose?: () => void;
};

export default function PhotoModal({ selectedPhoto, onClose }: Props) {
  return (
    <View>
      <Modal visible={!!selectedPhoto} transparent animationType="fade">
        <View className="flex-1 bg-black bg-opacity-80 justify-center items-center">
          <View className="bg-white rounded-lg p-4 items-center">
            {selectedPhoto?.uri ? (
              <Image
                source={{ uri: selectedPhoto.uri }}
                className="w-64 h-64 rounded-xl mb-3"
              />
            ) : (
              <Text className="text-gray-500">Aucune image</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}