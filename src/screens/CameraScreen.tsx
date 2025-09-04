// screens/CameraScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";
import { addPhoto } from "../features/photos/photoSlice";
import { v4 as uuidv4 } from "uuid";

// Si tu n'utilises pas uuid, remplace par Date.now() etc.
import { AppDispatch } from "../store";

export default function CameraScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isTaking, setIsTaking] = useState(false);
  const [preview, setPreview] = useState<CameraCapturedPicture | null>(null);
  const [locationAtShot, setLocationAtShot] = useState<Location.LocationObject | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      const cam = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cam.status === "granted");

      const loc = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(loc.status === "granted");
    })();
  }, []);

  async function takePicture() {
    if (!cameraRef.current || isTaking) return;
    setIsTaking(true);
    try {
      // get location as close as possible to the time of capture
      let loc: Location.LocationObject | null = null;
      if (hasLocationPermission) {
        try {
          loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, timeInterval: 0, maximumAge: 10000 });
        } catch (e) {
          console.warn("Location fetch failed at capture:", e);
        }
      }

      const options = { quality: 0.8, skipProcessing: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      setPreview(photo);
      setLocationAtShot(loc);
    } catch (e) {
      console.error("takePicture error", e);
      Alert.alert("Erreur", "Impossible de prendre la photo.");
    } finally {
      setIsTaking(false);
    }
  }

  async function savePhoto() {
    if (!preview) return;
    setLoadingSave(true);
    try {
      const id = uuidv4 ? uuidv4() : `${Date.now()}`;
      const timestamp = new Date().toISOString();
      // create dest path
      const fileName = `photo_${id}.jpg`;
      const dest = `${FileSystem.documentDirectory}photos/${fileName}`;

      // ensure folder exists
      const folder = `${FileSystem.documentDirectory}photos`;
      const folderInfo = await FileSystem.getInfoAsync(folder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      }

      // move the file to persistent folder
      await FileSystem.copyAsync({ from: preview.uri, to: dest });

      const photoItem = {
        id,
        uri: dest,
        timestamp,
        coords: locationAtShot
          ? {
              latitude: locationAtShot.coords.latitude,
              longitude: locationAtShot.coords.longitude,
              altitude: locationAtShot.coords.altitude ?? null,
              accuracy: locationAtShot.coords.accuracy ?? null,
            }
          : undefined,
        address: null, // tu peux ajouter reverse geocoding si tu veux
        notes: null,
      };

      dispatch(addPhoto(photoItem));
      // reset preview
      setPreview(null);
      setLocationAtShot(null);
      Alert.alert("Enregistré", "Photo sauvegardée dans le journal.");
    } catch (e) {
      console.error("savePhoto error", e);
      Alert.alert("Erreur", "Impossible de sauvegarder la photo.");
    } finally {
      setLoadingSave(false);
    }
  }

  function discardPreview() {
    setPreview(null);
    setLocationAtShot(null);
  }

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Demande de permissions...</Text>
      </View>
    );
  }
  if (hasCameraPermission === false) {
    return (
      <View style={styles.center}>
        <Text>Permission caméra refusée. Active la caméra dans les paramètres.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!preview ? (
        <>
          <Camera style={styles.camera} ref={(ref) => (cameraRef.current = ref)} ratio="16:9" autoFocus="on" >
            <View style={styles.topBar}>
              <Text style={styles.topText}>Caméra</Text>
            </View>
            <View style={styles.bottomBar}>
              <Pressable style={styles.captureButton} onPress={takePicture} disabled={isTaking}>
                {isTaking ? <ActivityIndicator /> : <Text style={styles.captureText}>📷</Text>}
              </Pressable>
            </View>
          </Camera>
          <View style={styles.hint}>
            <Text>Appuie sur le bouton pour prendre une photo. La position GPS sera récupérée automatiquement.</Text>
            {hasLocationPermission ? <Text style={{ marginTop: 6 }}>Localisation active ✅</Text> : <Text style={{ marginTop: 6 }}>Localisation indisponible ❌</Text>}
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview.uri }} style={styles.previewImage} resizeMode="contain" />
          <View style={styles.previewMeta}>
            <Text>Prise le : {new Date().toLocaleString()}</Text>
            {locationAtShot ? (
              <Text>
                Position : {locationAtShot.coords.latitude.toFixed(6)}, {locationAtShot.coords.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text>Position : non disponible</Text>
            )}
          </View>
          <View style={styles.previewActions}>
            <Pressable style={styles.cancelBtn} onPress={discardPreview}><Text>Annuler</Text></Pressable>
            <Pressable style={styles.saveBtn} onPress={savePhoto} disabled={loadingSave}>
              {loadingSave ? <ActivityIndicator /> : <Text style={{ color: "white" }}>Sauvegarder</Text>}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, backgroundColor: "#fff" },
  camera: { flex: 1 },
  topBar: { position: "absolute", top: 20, left: 10 },
  topText: { color: "#fff", fontWeight: "600" },
  bottomBar: { position: "absolute", bottom: 30, width: "100%", alignItems: "center", justifyContent: "center" },
  captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  captureText: { fontSize: 28 },
  hint: { padding: 12 },
  previewContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12 },
  previewImage: { width: "100%", height: "60%", borderRadius: 8, backgroundColor: "#000" },
  previewMeta: { marginTop: 10, alignItems: "center" },
  previewActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", padding: 16 },
  cancelBtn: { padding: 12, borderRadius: 8, backgroundColor: "#eee" },
  saveBtn: { padding: 12, borderRadius: 8, backgroundColor: "#2196F3" },
});
