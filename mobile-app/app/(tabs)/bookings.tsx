import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/my`);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return '#10B981';
      case 'Cancelled': return '#EF4444';
      case 'Completed': return '#3B82F6';
      default: return '#F59E0B'; // Pending
    }
  };

  const renderBooking = ({ item }: { item: any }) => (
    <ThemedView style={[styles.bookingCard, { backgroundColor: Colors[colorScheme].muted }]}>
      <Image 
        source={{ 
          uri: item.destination.image?.startsWith('http') 
            ? item.destination.image 
            : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' 
        }} 
        style={styles.bookingImage} 
      />
      <View style={styles.bookingDetails}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={styles.destName}>{item.destination.name}</ThemedText>
        <View style={styles.infoRow}>
          <IconSymbol name="location-on" size={14} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.infoText}>{item.destination.location}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol name="calendar-today" size={14} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.infoText}>{new Date(item.bookingDate).toLocaleDateString()}</ThemedText>
        </View>
        <ThemedText style={styles.price}>${item.totalPrice}</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">My Bookings</ThemedText>
        <ThemedText style={styles.subtitle}>Track your travel adventures</ThemedText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <IconSymbol name="event-busy" size={60} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.emptyText}>No bookings yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Your dream trips will appear here!</ThemedText>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[colorScheme].tint} />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.5,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  list: {
    gap: 20,
    paddingBottom: 100,
  },
  bookingCard: {
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 12,
    gap: 15,
  },
  bookingImage: {
    width: 100,
    height: 120,
    borderRadius: 18,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  destName: {
    fontSize: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A86FF',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    opacity: 0.5,
    marginTop: 8,
    textAlign: 'center',
  }
});
