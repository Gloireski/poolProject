import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/api';
import * as Location from 'expo-location';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

// Build the correct base URL for images
const getBaseUrl = () => {
  return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://127.0.0.1:3001';
};

// Function to get city information from coordinates using Expo Location
const getCityFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    if (reverseGeocode && reverseGeocode[0]) {
      const location = reverseGeocode[0];
      const city = location.city || location.subregion || location.region || 'Unknown city';
      const country = location.country || 'Unknown country';
      const street = location.street || '';
      const region = location.region || '';
      const fullAddress = [street, city, region, country].filter(Boolean).join(', ');
      return { city, country, fullAddress: fullAddress || 'Unknown location' };
    }
  } catch (error) {
    console.error('[geocoding] Reverse geocoding error:', error);
  }
  return { city: 'Unknown city', country: 'Unknown country', fullAddress: 'Unknown location' };
};

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((s: any) => s.auth.user);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState<string>(user?.description || '');

  // Update avatar URL when user changes
  useEffect(() => {
    if (user?.avatarUrl) {
      const fullUrl = user.avatarUrl.startsWith('http') 
        ? user.avatarUrl 
        : `${getBaseUrl()}${user.avatarUrl}`;
      setAvatarUrl(fullUrl);
    }
    if (user?.description !== undefined) {
      setDescription(user.description || '');
    }
  }, [user?.avatarUrl, user?.description]);

  const takePicture = async () => {
    try {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cam.status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take a profile picture');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to take picture');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    setUploading(true);
    try {
      let latitude = 0; 
      let longitude = 0;
      let city = 'Unknown city';
      let country = 'Unknown country';
      let fullAddress = 'Unknown location';
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          latitude = loc.coords.latitude; 
          longitude = loc.coords.longitude;
          const locationInfo = await getCityFromCoordinates(latitude, longitude);
          city = locationInfo.city;
          country = locationInfo.country;
          fullAddress = locationInfo.fullAddress;
        }
      } catch (e) {
        console.log('[location] permission/location error:', e);
      }
      const formData = new FormData();
      if (!uri) {
        Alert.alert('Error', 'No image URI provided');
        return;
      }
      formData.append('image', ({ uri, type: 'image/jpeg', name: 'profile-picture.jpg' } as unknown) as any);
      formData.append('latitude', String(latitude));
      formData.append('longitude', String(longitude));
      formData.append('city', city);
      formData.append('country', country);
      formData.append('capturedAt', new Date().toISOString());
      formData.append('address', fullAddress);
      formData.append('notes', `Profile picture taken in ${city}, ${country}`);
      const response = await api.post('/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = response?.data?.imageUrl as string | undefined;
      if (url) {
        const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
        setAvatarUrl(fullUrl);
      }
      Alert.alert('Success', `Profile picture updated!`);
    } catch (error: any) {
      Alert.alert('Upload failed', error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await api.patch('/users/me', { description });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e: any) {
      console.log('[profile] save error:', e?.response?.data || e?.message);
      Alert.alert('Save failed', e?.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  // Build the final avatar URL
  const resolvedAvatar = avatarUrl || user?.avatarUrl ? 
    (user.avatarUrl?.startsWith('http') ? user.avatarUrl : `${getBaseUrl()}${user?.avatarUrl || ''}`) : 
    'https://via.placeholder.com/160';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: resolvedAvatar }} style={styles.profileImage} />
            <TouchableOpacity onPress={takePicture} style={styles.changeAvatarButton} disabled={uploading}>
              <Text style={styles.changeAvatarText}>{uploading ? 'Uploading...' : 'Change'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.fullName || 'Unnamed'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Card>

        <Card variant="default" style={styles.formCard}>
          <Text style={styles.sectionTitle}>About you</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Write a short description about yourself"
            placeholderTextColor="#9aa0a6"
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
            maxLength={300}
          />
          <Button title={saving ? 'Saving...' : 'Save profile'} onPress={saveProfile} disabled={saving} />
        </Card>

        <Card variant="default" style={styles.actionsCard}>
          <Button title="Take Profile Picture" onPress={takePicture} disabled={uploading} />
          <View style={{ height: 12 }} />
          <Button title="Choose from Gallery" onPress={pickImage} disabled={uploading} variant="secondary" />
          <View style={{ height: 12 }} />
          <Button title="Logout" onPress={() => dispatch<any>(logout())} variant="outline" />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f9',
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
  },
  changeAvatarButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  changeAvatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
  },
  email: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 10,
  },
  descriptionInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    color: '#202124',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  actionsCard: {
    padding: 16,
    marginBottom: 24,
  },
});
