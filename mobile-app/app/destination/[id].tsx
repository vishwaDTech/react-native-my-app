import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/context/FavoritesContext';

const { width } = Dimensions.get('window');


// Mock data for demonstration - in a real app this would come from an API based on the ID
const DESTINATION_DETAILS = {
  '1': {
    name: 'Bora Bora',
    location: 'French Polynesia',
    price: '$1200',
    rating: '4.9',
    reviews: '1.2k reviews',
    description: 'Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus (islets) and a turquoise lagoon protected by a coral reef, it’s known for its scuba diving and luxury resorts where some guest quarters are perched over the water on stilts.',
    image: require('@/assets/images/tropical_beach.png'),
  },
  '2': {
    name: 'Swiss Alps',
    location: 'Switzerland',
    price: '$950',
    rating: '4.8',
    reviews: '850 reviews',
    description: 'The Swiss Alps are a major mountain range in Switzerland. They are known for their stunning scenery, world-class skiing, and charming alpine villages. Whether you are looking for adventure or relaxation, the Swiss Alps have something for everyone.',
    image: require('@/assets/images/snowy_mountain.png'),
  },
  '3': {
    name: 'Tokyo',
    location: 'Japan',
    price: '$800',
    rating: '4.7',
    reviews: '2.5k reviews',
    description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.',
    image: require('@/assets/images/vibrant_city.png'),
  },
};

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const destination = DESTINATION_DETAILS[id as keyof typeof DESTINATION_DETAILS] || DESTINATION_DETAILS['1'];
  const favorited = isFavorite(id || '1');

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={destination.image} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={28} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.favButton, favorited && { backgroundColor: 'rgba(255, 59, 48, 0.2)' }]} 
              onPress={() => toggleFavorite(id || '1')}
            >
              <IconSymbol name="heart.fill" size={24} color={favorited ? '#FF3B30' : '#FFF'} />
            </TouchableOpacity>
          </View>
        </View>


        {/* Content */}
        <View style={[styles.content, { backgroundColor: Colors[colorScheme].background }]}>
          <View style={styles.indicator} />
          
          <View style={styles.mainInfo}>
            <View>
              <ThemedText type="title" style={styles.name}>{destination.name}</ThemedText>
              <View style={styles.locationRow}>
                <IconSymbol name="location-on" size={16} color={Colors[colorScheme].tint} />
                <ThemedText style={styles.locationText}>{destination.location}</ThemedText>
              </View>
            </View>
            <View style={styles.ratingBox}>
              <IconSymbol name="star" size={16} color="#FFBE0B" />
              <ThemedText style={styles.ratingText}>{destination.rating}</ThemedText>
            </View>
          </View>

          <View style={[styles.statsRow, { borderBottomColor: Colors[colorScheme].border, borderTopColor: Colors[colorScheme].border }]}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
              <ThemedText type="defaultSemiBold">5 Days</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Distance</ThemedText>
              <ThemedText type="defaultSemiBold">1.2k km</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Temp</ThemedText>
              <ThemedText type="defaultSemiBold">24°C</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.descriptionText}>{destination.description}</ThemedText>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Location Map</ThemedText>
              <TouchableOpacity>
                <ThemedText style={{ color: Colors[colorScheme].tint }}>View on Map</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={[styles.mapPlaceholder, { backgroundColor: Colors[colorScheme].muted }]}>
              <IconSymbol name="location-on" size={40} color={Colors[colorScheme].tint} />
              <ThemedText style={{ opacity: 0.5, marginTop: 10 }}>Map View Placeholder</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Reviews ({destination.reviews})</ThemedText>
              <TouchableOpacity>
                <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            {/* Simple Review Placeholder */}
            <View style={[styles.reviewItem, { backgroundColor: Colors[colorScheme].muted }]}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewUser}>
                  <View style={styles.avatarSmall} />
                  <ThemedText type="defaultSemiBold">Alex Smith</ThemedText>
                </View>
                <ThemedText style={styles.reviewDate}>2 days ago</ThemedText>
              </View>
              <ThemedText style={styles.reviewText}>Amazing experience! The views were absolutely breathtaking. Highly recommend visiting during sunset.</ThemedText>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: Colors[colorScheme].background, borderTopColor: Colors[colorScheme].border }]}>
        <View>
          <ThemedText style={styles.priceLabel}>Total Price</ThemedText>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceValue}>{destination.price}</ThemedText>
            <ThemedText style={styles.priceUnit}>/person</ThemedText>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={() => router.push(`/booking/${id}`)}
        >
          <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
        </TouchableOpacity>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    opacity: 0.6,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 190, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#FFBE0B',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  descriptionText: {
    lineHeight: 24,
    opacity: 0.7,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  reviewItem: {
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
  },
  reviewDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingHorizontal: 24,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  priceLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    opacity: 0.6,
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3A86FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
