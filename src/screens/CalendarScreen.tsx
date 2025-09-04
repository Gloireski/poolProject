import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import { api } from '../services/api';
import { useAppDispatch } from '../store';
import { fetchPhotos } from '../store/slices/photosSlice';

interface Photo {
  _id: string;
  uri: string;
  capturedAt: string;
  isProfilePicture?: boolean;
}

interface DateGroup { date: string; displayDate: string; photos: Photo[] }

export default function CalendarScreen() {
  const dispatch = useAppDispatch();
  const [marked, setMarked] = useState<any>({});
  const [date, setDate] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/calendar/days-with-photos');
      const m: any = {};
      res.data.forEach((d: { date: string; count: number }) => {
        m[d.date] = { marked: true, dots: [{ color: 'blue' }] };
      });
      setMarked(m);
    })();
  }, []);

  const loadForDate = async (dateStr: string) => {
    setDate(dateStr);
    try {
      const res = await api.get('/photos', { params: { date: dateStr, page: 1, limit: 100 } });
      setPhotos(res.data.items || []);
      // keep Redux in sync for other screens
      dispatch<any>(fetchPhotos({ page: 1, limit: 15, date: dateStr }));
    } catch (e) {
      setPhotos([]);
    }
  };

  const onDayPress = (day: DateObject) => {
    loadForDate(day.dateString);
  };

  const dateGroups = useMemo<DateGroup[]>(() => {
    if (!photos.length) return [];
    const grouped = photos.reduce((acc: any, p) => {
      const k = new Date(p.capturedAt).toDateString();
      acc[k] = acc[k] || [];
      acc[k].push(p);
      return acc;
    }, {} as Record<string, Photo[]>);
    return Object.entries(grouped)
      .map(([k, ps]) => ({
        date: k,
        displayDate: new Date(k).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        photos: ps,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [photos]);

  const renderPhoto = ({ item }: { item: Photo }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.uri.startsWith('http') ? item.uri : `http://127.0.0.1:3001${item.uri}` }} style={styles.photoImage} />
      {item.isProfilePicture ? <Text style={styles.profileBadge}>👤</Text> : null}
    </View>
  );

  const renderDateGroup = ({ item }: { item: DateGroup }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.displayDate}</Text>
      <View style={styles.photosContainer}>
        {item.photos.map((p) => (
          <View style={styles.photoWrapper} key={p._id}>
            {renderPhoto({ item: p })}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Calendar markedDates={marked} onDayPress={onDayPress} />
      {date ? (
        <FlatList
          data={dateGroups}
          keyExtractor={(it) => it.date}
          renderItem={renderDateGroup}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>No photos</Text>}
        />
      ) : (
        <Text style={styles.hint}>Select a date to view photos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16 },
  hint: { padding: 12 },
  empty: { padding: 16, textAlign: 'center', color: '#666' },
  dateGroup: { marginTop: 16 },
  dateHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  photosContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  photoWrapper: { width: '32%', marginBottom: 8 },
  photoContainer: { width: '100%', aspectRatio: 1, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  profileBadge: { position: 'absolute', top: 6, right: 6, fontSize: 12 },
});
