import React, { useMemo, useRef, useState } from "react";
import { 
    View, Text, Pressable, Image, StyleSheet, Platform,
    ActivityIndicator

} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Callout } from "react-native-maps";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Modal } from "react-native";
import { getItemAsync } from "expo-secure-store";
import { Photo } from "../types/photosTypes";
import { usePhotos } from "../hooks/usePhotos";
import host from "../services/api";


export default function MapScreen() {
    // Hook React Query toujours appelé (ne jamais conditionner les hooks)
    const { data: remotePhotos, isLoading, error } = usePhotos();
    const status = useSelector((state: RootState) => state.auth.status);
    const { photos: localPhotos = [] } = useSelector((state: RootState) => state.photos) || {};


    // Choix des photos selon le status

    const photos: Photo[] = useMemo(() => {
        if (status === "authenticated") {
            return remotePhotos || [];
        }
        return localPhotos || [];
    }, [status, remotePhotos, localPhotos]);

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const mapRef = useRef<MapView | null>(null);

    const formatter = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const normalizeUri = (photo: Photo) => {
        const src = photo.downloadUrl || photo.uri;
        if (!src) return "";
        // Si c’est déjà une URL complète (serveur)
        if (src.startsWith("http")) return src;
        // Si c’est un chemin local Expo (guest)
        if (src.startsWith("file:") || src.startsWith("content:")) return src;
        // ton IP locale pour Expo Go
        const baseUrl = `http://${host}:3001`; 
        console.log("Normalized URI:", `${baseUrl}${src.startsWith("/") ? src : "/" + src}`);
        return `${baseUrl}${src.startsWith("/") ? src : "/" + src}`;
    };


  const photoPoints = useMemo(() => {
      return photos
          .map((p: any) => {
              const latitude = p?.latitude ?? p?.location?.latitude;
                const longitude = p?.longitude ?? p?.location?.longitude;
                if (typeof latitude === 'number' && typeof longitude === 'number') {
                    return { ...p, latitude, longitude };
                }
                return null;
            })
            .filter(Boolean) as Array<any & { latitude: number; longitude: number }>; 
    }, [photos]);

    const initialRegion: Region = useMemo(() => {
        if (photoPoints.length > 0) {
            const latest = [...photoPoints].sort((a, b) => {
                const ad = new Date(a.capturedAt || a.createdAt || a.date || 0).getTime();
                const bd = new Date(b.capturedAt || b.createdAt || b.date || 0).getTime();
                return bd - ad;
            })[0];
            return {
                latitude: latest.latitude,
                longitude: latest.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
        }
        return { latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.05, longitudeDelta: 0.05 };
    }, [photoPoints]);

    const animateToRegion = (region: Region) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(region, 300);
        }
    };

    const handleZoom = (factor: number) => {
        if (!mapRef.current) return;
        mapRef.current.getMapBoundaries?.().then(() => {
            const r = initialRegion; // fallback
            const current = (mapRef.current as any).__lastRegion || r;
            const next: Region = {
                ...current,
                latitudeDelta: current.latitudeDelta * factor,
                longitudeDelta: current.longitudeDelta * factor,
            };
            animateToRegion(next);
        }).catch(() => {
            // fallback animate
            animateToRegion({
                ...initialRegion,
                latitudeDelta: initialRegion.latitudeDelta * factor,
                longitudeDelta: initialRegion.longitudeDelta * factor,
            });
        });
    };

    const handleReload = () => {
        // Recenter on the latest photo (or fallback)
        animateToRegion(initialRegion);
    };

    return (
        <View style={{ flex: 1 }}>
            {status === "authenticated" && isLoading && <ActivityIndicator />}
            {status === "authenticated" && error && <Text>Erreur de chargement</Text>}
            <MapView
                ref={mapRef}
                {...(Platform.OS === 'android' ? { provider: PROVIDER_GOOGLE } : {})}
                style={StyleSheet.absoluteFillObject}
                initialRegion={initialRegion}
            >
                {photoPoints.map((p) => (
                    <Marker
                        key={p._id || p.id || `${p.latitude},${p.longitude},${p.capturedAt || p.date || ''}`}
                        coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                        onPress={() => setSelectedPhoto(p)}
                    >
                        <Callout>
                            <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center', fontWeight: "bold", fontSize: 14 }}>
                                {formatter.format(new Date(p.capturedAt || p.createdAt || p.date || Date.now()))}
                            </Text>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Controls */}
            <View style={styles.controls}>
                <Pressable style={styles.controlBtn} onPress={() => handleZoom(0.7)}>
                    <Text style={styles.controlText}>＋</Text>
                </Pressable>
                <Pressable style={styles.controlBtn} onPress={() => handleZoom(1.3)}>
                    <Text style={styles.controlText}>－</Text>
                </Pressable>
                <Pressable style={[styles.controlBtn, styles.reloadBtn]} onPress={handleReload}>
                    <Text style={styles.reloadText}>↺</Text>
                </Pressable>
            </View>

            <Modal
                visible={!!selectedPhoto}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedPhoto(null)} // Android back
                >
                {/* Overlay qui capte le clic pour fermer */}
                <Pressable style={styles.modalContainer} onPress={() => setSelectedPhoto(null)}>
                    {/* Contenu qui bloque la propagation du clic */}
                    <Pressable style={styles.modalContent} onPress={() => {}}>
                    {selectedPhoto?.uri ? (
                        <Image source={{ uri: normalizeUri(selectedPhoto) }} style={styles.image} />

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
                    </Pressable>
                </Pressable>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    alignItems: 'center',
    gap: 10,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  controlText: { fontSize: 22, color: '#111827', fontWeight: '600' },
  reloadBtn: { backgroundColor: '#0F4C81' },
  reloadText: { fontSize: 20, color: '#fff', fontWeight: '700' },

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
    // width: 300,
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
