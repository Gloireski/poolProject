import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { api } from '../services/api';
import { useAppDispatch } from '../store';
import { refreshPhotos } from '../store/slices/photosSlice';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const toggleFacing = () => {
    setFacing((p) => (p === 'back' ? 'front' : 'back'));
  };

  const takePhoto = async () => {
    try {
      if (!cameraRef.current || !isReady) return;
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });
      const src = photo?.uri;
      if (!src) return;
      // Persist to cache to avoid preview issues with transient content:// URIs
      const dest = `${FileSystem.cacheDirectory}capture-${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });
      setCapturedUri(dest);
    } catch (e: any) {
      Alert.alert('Camera error', e?.message || 'Failed to take photo');
    }
  };

  const uploadPhoto = async () => {
    if (!capturedUri) return;
    setUploading(true);
    try {
      let latitude = 0, longitude = 0;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          latitude = loc.coords.latitude; longitude = loc.coords.longitude;
        }
      } catch {}

      const form = new FormData();
      form.append('image', ({ uri: capturedUri, type: 'image/jpeg', name: 'capture.jpg' } as unknown) as any);
      form.append('latitude', String(latitude));
      form.append('longitude', String(longitude));
      form.append('capturedAt', new Date().toISOString());
      form.append('address', '');
      form.append('notes', '');

      console.log('[camera] uploading photo...', form);

      await api.post('/photos', form, { headers: { 'Content-Type': 'multipart/form-data' } });

      setCapturedUri(null);
      Alert.alert('Uploaded', 'Photo added to your gallery.');
      dispatch<any>(refreshPhotos({ page: 1, limit: 15 }));
    } catch (e: any) {
      Alert.alert('Upload failed', e?.response?.data?.message || e?.message || 'Unable to upload');
    } finally {
      setUploading(false);
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permTitle}>Camera permission required</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        onCameraReady={() => setIsReady(true)}
      />

      {/* Overlay controls */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleFacing}>
          <MaterialCommunityIcons name="camera-switch" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        {!capturedUri ? (
          <TouchableOpacity style={[styles.captureBtn, !isReady && { opacity: 0.5 }]} onPress={takePhoto} disabled={!isReady} />
        ) : (
          <View style={styles.previewActionsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.discard]} onPress={() => setCapturedUri(null)}>
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.upload]} onPress={uploadPhoto} disabled={uploading}>
              <Text style={styles.actionText}>{uploading ? 'Uploading...' : 'Use Photo'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {capturedUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedUri }} style={styles.preview} onError={(e) => console.log('[camera] preview error:', e?.nativeEvent)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permTitle: { fontSize: 16, marginBottom: 12 },
  permBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#0F4C81', borderRadius: 8 },
  permBtnText: { color: '#fff', fontWeight: '600' },

  topBar: { position: 'absolute', top: 24, left: 16, right: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },

  bottomBar: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  captureBtn: { width: 74, height: 74, borderRadius: 37, borderWidth: 6, borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.2)' },

  previewContainer: { position: 'absolute', bottom: 120, alignSelf: 'center', width: 140, height: 200, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#fff' },
  preview: { width: '100%', height: '100%' },
  previewActionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  actionText: { color: '#fff', fontWeight: '700' },
  discard: { backgroundColor: 'rgba(0,0,0,0.5)' },
  upload: { backgroundColor: '#0F4C81' },
});
