import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  useEffect(() => {
    fetchDestinationDetails();
  }, [id]);

  const fetchDestinationDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/destinations/${id}`);
      setDestination(response.data.data);
    } catch (error) {
      console.error('Error fetching destination details:', error);
      Alert.alert('Error', 'Could not load destination details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setBookingLoading(true);
    try {
      await axios.post(`${API_URL}/bookings`, { destinationId: id });
      Alert.alert(
        'Success!', 
        'Your trip has been booked successfully. You can view it in your bookings.',
        [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Booking Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      </ThemedView>
    );
  }

  if (!destination) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Destination not found</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText style={{ color: Colors[colorScheme].tint }}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: destination.image?.startsWith('http') 
                ? destination.image 
                : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' 
            }} 
            style={styles.heroImage} 
          />
          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerBtn, { right: 20 }]}
          >
            <IconSymbol name="heart" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          <View style={styles.titleRow}>
            <View className="flex-1">
              <ThemedText type="title" style={styles.title}>{destination.name}</ThemedText>
              <View style={styles.locationContainer}>
                <IconSymbol name="location-on" size={16} color={Colors[colorScheme].tint} />
                <ThemedText style={styles.locationText}>{destination.location}</ThemedText>
              </View>
            </View>
            <View style={styles.ratingBox}>
              <IconSymbol name="star" size={16} color="#FFBE0B" />
              <ThemedText style={styles.ratingText}>{destination.rating || '4.5'}</ThemedText>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <IconSymbol name="clock" size={20} color={Colors[colorScheme].tint} />
              </View>
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
              <ThemedText style={styles.statValue}>{destination.duration}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <IconSymbol name="terrain" size={20} color={Colors[colorScheme].tint} />
              </View>
              <ThemedText style={styles.statLabel}>Category</ThemedText>
              <ThemedText style={styles.statValue}>{destination.category}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <IconSymbol name="payments" size={20} color={Colors[colorScheme].tint} />
              </View>
              <ThemedText style={styles.statLabel}>Price</ThemedText>
              <ThemedText style={styles.statValue}>${destination.price}</ThemedText>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <ThemedText type="subtitle" style={styles.subtitle}>Description</ThemedText>
            <ThemedText style={styles.descriptionText}>
              {destination.description}
            </ThemedText>
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: Colors[colorScheme].background, borderTopColor: Colors[colorScheme].border }]}>
        <View>
          <ThemedText style={styles.bottomPriceLabel}>Total Price</ThemedText>
          <ThemedText style={styles.bottomPriceValue}>${destination.price}</ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.bookBtn} 
          onPress={handleBook}
          disabled={bookingLoading}
        >
          {bookingLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.bookBtnText}>Book Now</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    marginTop: -40,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    minHeight: 500,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    opacity: 0.6,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionSection: {
    gap: 15,
  },
  subtitle: {
    fontSize: 20,
  },
  descriptionText: {
    lineHeight: 26,
    opacity: 0.7,
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  bottomPriceLabel: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: 'bold',
  },
  bottomPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A86FF',
  },
  bookBtn: {
    backgroundColor: '#3A86FF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#3A86FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    marginTop: 20,
    padding: 10,
  }
});
