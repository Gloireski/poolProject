import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import { api } from '../services/api';

export default function CalendarScreen() {
  const [marked, setMarked] = useState<any>({});

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

  const onDayPress = (day: DateObject) => {
    // TODO: navigate to Gallery with filter
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar markedDates={marked} onDayPress={onDayPress} />
      <Text style={{ padding: 12 }}>Select a date to view photos</Text>
    </View>
  );
}
