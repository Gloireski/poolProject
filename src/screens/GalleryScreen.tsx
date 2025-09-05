import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import {
  fetchPhotos,
  loadMorePhotos,
  refreshPhotos,
  setDateFilter,
} from "../store/slices/photosSlice";
import { Photo } from "../types/photosTypes";
import { Platform } from "react-native";
import host from "../services/api";
import { usePhotos } from "../hooks/usePhotos";

// Build the correct base URL for images
const getBaseUrl = () => {
  // return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://127.0.0.1:3001';
  return `http://${host}:3001`;
};
const normalizePhotoUri = (photo: Photo): string => {
  const src = photo.uri; // pour guest tu stockes déjà uri, pour serveur ton API renvoie aussi un champ (ex: /downloads/img.jpg)

  if (!src) return "";

  // Cas absolu (http://... ou file://)
  if (src.startsWith("http") || src.startsWith("file:") || src.startsWith("content:")) {
    return src;
  }

  // Sinon, chemin relatif venant du serveur (/downloads/...)
  return `${getBaseUrl()}${src.startsWith("/") ? src : "/" + src}`;
};


interface DateGroup {
  date: string;
  photos: Photo[];
  displayDate: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GalleryScreen({ route }: any) {
  const dispatch = useAppDispatch();
  // const { photos, loading, error, hasMore, currentPage } = useSelector(
  //   (state: RootState) => state.photos
  // );
  // Redux photos = local (guest)
  const { photos: localPhotos, loading, error, hasMore, currentPage } = useSelector(
    (state: RootState) => state.photos
  );

  // React Query photos = serveur
  const { data: remotePhotos = [], isLoading: loadingRemote, error: errorRemote } = usePhotos();

  const date = route?.params?.date as string | undefined;
  const status = useSelector((state: RootState) => state.auth.status);

  // Selon status
  const photos: Photo[] = status === "authenticated" ? remotePhotos : localPhotos;
  console.log('photos', photos)
  
  // Photo detail modal state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showPhotoDetail, setShowPhotoDetail] = useState(false);

  useEffect(() => {
    // Reset date filter when route params change
    dispatch(setDateFilter(date));
    // Fetch initial photos
    dispatch(fetchPhotos({ page: 1, limit: 15, date }));
  }, [date, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (status === "guest") {
      // dans ce cas, tes photos locales ne supportent pas "loadMore"
      return;
    }
    if (!hasMore || loading) return;
    dispatch(loadMorePhotos({ page: currentPage + 1, limit: 15, date }));
  }, [hasMore, loading, currentPage, date, dispatch]);

  const handleRefresh = useCallback(() => {
    if (status === "guest") {
      // Pour guest, pas besoin d'aller au backend
      return;
    }
    dispatch(refreshPhotos({ page: 1, limit: 15, date }));
  }, [date, dispatch]);

  // Group photos by date and create date-aligned structure
  const dateGroups = useMemo(() => {
    if (!photos.length) return [];

    // Group photos by date
    const grouped = photos.reduce((acc: { [key: string]: Photo[] }, photo) => {
      const dateKey = new Date(photo.capturedAt).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(photo);
      return acc;
    }, {});

    // Convert to array and sort by date
    const sortedGroups = Object.entries(grouped)
      .map(([dateKey, photos]) => ({
        date: dateKey,
        photos,
        displayDate: new Date(dateKey).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sortedGroups;
  }, [photos]);

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowPhotoDetail(true);
  };

  const closePhotoDetail = () => {
    setShowPhotoDetail(false);
    setSelectedPhoto(null);
  };

  const renderPhoto = ({ item }: { item: Photo }) => {
    // Build full image URL from relative URI
    const imageUrl = normalizePhotoUri(item);
    // const imageUrl = item.uri.startsWith('http') 
    //   ? item.uri 
    //   : `${getBaseUrl()}${item.uri}`;
    
    return (
      <TouchableOpacity 
        style={styles.photoContainer}
        onPress={() => handlePhotoPress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.photoImage}
          resizeMode="cover"
        />
        {/* Profile picture indicator */}
        {item.isProfilePicture && (
          <View style={styles.profileIndicator}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDateGroup = ({ item }: { item: DateGroup }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.displayDate}</Text>
      <View style={styles.photosContainer}>
        {item.photos.map((photo) => (
          <View key={photo._id} style={styles.photoWrapper}>
            {renderPhoto({ item: photo })}
          </View>
        ))}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" />
    </View>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dateGroups}
        keyExtractor={(item) => item.date}
        renderItem={renderDateGroup}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={loading && currentPage === 1}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No photos yet</Text>
            </View>
          ) : null
        }
        ListFooterComponent={hasMore ? renderFooter : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Photo Detail Modal */}
      <Modal
        visible={showPhotoDetail}
        animationType="fade"
        transparent={true}
        onRequestClose={closePhotoDetail}
      >
        <View style={styles.photoDetailOverlay}>
          <TouchableOpacity 
            style={styles.photoDetailBackground} 
            onPress={closePhotoDetail}
            activeOpacity={1}
          />
          
          <View style={styles.photoDetailContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.photoDetailCloseButton}
              onPress={closePhotoDetail}
            >
              <Text style={styles.photoDetailCloseText}>✕</Text>
            </TouchableOpacity>
            
            {/* Photo */}
            {selectedPhoto && (
              <>
                <Image
                  source={{ uri: selectedPhoto ? normalizePhotoUri(selectedPhoto) : "" }}
                  style={styles.photoDetailImage}
                  resizeMode="contain"
                />
                
                {/* Photo Details */}
                <View style={styles.photoDetailInfo}>
                  <Text style={styles.photoDetailTitle}>
                    {selectedPhoto.isProfilePicture ? 'Profile Picture' : 'Photo'}
                  </Text>
                  
                  <View style={styles.photoDetailRow}>
                    <Text style={styles.photoDetailLabel}>📅 Date:</Text>
                    <Text style={styles.photoDetailValue}>
                      {formatDate(selectedPhoto.capturedAt)}
                    </Text>
                  </View>
                  
                  <View style={styles.photoDetailRow}>
                    <Text style={styles.photoDetailLabel}>📍 Location:</Text>
                    <Text style={styles.photoDetailValue}>
                      {selectedPhoto.address || 'Unknown location'}
                    </Text>
                  </View>
                  
                  {selectedPhoto.notes && (
                    <View style={styles.photoDetailRow}>
                      <Text style={styles.photoDetailLabel}>📝 Notes:</Text>
                      <Text style={styles.photoDetailValue}>
                        {selectedPhoto.notes}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.photoDetailRow}>
                    <Text style={styles.photoDetailLabel}>🌐 Coordinates:</Text>
                    <Text style={styles.photoDetailValue}>
                      {selectedPhoto.latitude?.toFixed(6)}, {selectedPhoto.longitude?.toFixed(6)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  listContent: {
    padding: 16,
  },
  
  dateGroup: {
    marginBottom: 24,
  },
  
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  photoWrapper: {
    width: '32%',
    marginBottom: 8,
    marginRight: 2,
  },
  
  photoContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  
  photoImage: {
    width: '100%',
    height: '100%',
  },
  
  profileIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  profileIcon: {
    fontSize: 12,
    color: '#fff',
  },
  
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Photo Detail Modal Styles
  photoDetailOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  photoDetailBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  photoDetailContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  photoDetailCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoDetailCloseText: {
    fontSize: 24,
    color: '#333',
  },
  photoDetailImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  photoDetailInfo: {
    padding: 20,
    flex: 1,
  },
  photoDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photoDetailLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
  },
  photoDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
