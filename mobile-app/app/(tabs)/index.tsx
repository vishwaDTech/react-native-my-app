import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CATEGORIES = [
  { id: '1', name: 'Beach', icon: 'beach-access' },
  { id: '2', name: 'Mountain', icon: 'terrain' },
  { id: '3', name: 'City', icon: 'location-city' },
  { id: '4', name: 'Forest', icon: 'park' },
  { id: '5', name: 'Desert', icon: 'wb-sunny' },
];

const POPULAR_DESTINATIONS = [
  {
    id: '1',
    name: 'Bora Bora',
    location: 'French Polynesia',
    price: '$1200',
    rating: '4.9',
    image: require('@/assets/images/tropical_beach.png'),
  },
  {
    id: '2',
    name: 'Swiss Alps',
    location: 'Switzerland',
    price: '$950',
    rating: '4.8',
    image: require('@/assets/images/snowy_mountain.png'),
  },
  {
    id: '3',
    name: 'Tokyo',
    location: 'Japan',
    price: '$800',
    rating: '4.7',
    image: require('@/assets/images/vibrant_city.png'),
  },
];

const RECOMMENDED_PLACES = [
  {
    id: '1',
    name: 'Santorini',
    location: 'Greece',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Bali',
    location: 'Indonesia',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
  },
];

export default function DiscoverScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedCategory, setSelectedCategory] = useState('1');
  const router = useRouter();

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: selectedCategory === item.id ? Colors[colorScheme].tint : Colors[colorScheme].muted }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <IconSymbol 
        name={item.icon as any} 
        size={24} 
        color={selectedCategory === item.id ? '#FFF' : Colors[colorScheme].icon} 
      />
      <ThemedText style={[
        styles.categoryName,
        { color: selectedCategory === item.id ? '#FFF' : Colors[colorScheme].text }
      ]}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderDestination = ({ item }: { item: typeof POPULAR_DESTINATIONS[0] }) => (
    <TouchableOpacity style={styles.destinationCard} onPress={() => router.push(`/destination/${item.id}`)}>

      <Image source={item.image} style={styles.destinationImage} />
      <View style={styles.ratingBadge}>
        <IconSymbol name="star" size={12} color="#FFBE0B" />
        <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
      </View>
      <View style={styles.destinationInfo}>
        <ThemedText type="defaultSemiBold" style={styles.destinationName}>{item.name}</ThemedText>
        <View style={styles.locationContainer}>
          <IconSymbol name="location-on" size={14} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.locationText}>{item.location}</ThemedText>
        </View>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.priceText}>{item.price}</ThemedText>
          <ThemedText style={styles.priceSubtext}>/person</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommended = (item: typeof RECOMMENDED_PLACES[0]) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.recommendedCard, { backgroundColor: Colors[colorScheme].muted }]}
      onPress={() => router.push(`/destination/${item.id}`)}
    >

      <Image source={{ uri: item.image }} style={styles.recommendedImage} />
      <View style={styles.recommendedInfo}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <View style={styles.locationContainer}>
          <IconSymbol name="location-on" size={12} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.locationText}>{item.location}</ThemedText>
        </View>
      </View>
      <View style={styles.recommendedRating}>
        <IconSymbol name="star" size={14} color="#FFBE0B" />
        <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.title}>Where to next?</ThemedText>
            <TouchableOpacity style={[styles.notificationBtn, { borderColor: Colors[colorScheme].border }]}>
              <IconSymbol name="notifications" size={24} color={Colors[colorScheme].text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: Colors[colorScheme].muted }]}>
            <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme].icon} />
            <TextInput 
              placeholder="Search destinations" 
              placeholderTextColor={Colors[colorScheme].icon}
              style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <IconSymbol name="tune" size={20} color={Colors[colorScheme].tint} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Categories</ThemedText>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Destinations</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={POPULAR_DESTINATIONS}
            renderItem={renderDestination}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recommended for you</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.recommendedList}>
            {RECOMMENDED_PLACES.map(renderRecommended)}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 25,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 18,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterBtn: {
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  destinationsList: {
    gap: 16,
  },
  destinationCard: {
    width: 220,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  destinationInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  destinationName: {
    color: '#FFF',
    fontSize: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    color: '#EEE',
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    gap: 2,
  },
  priceText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceSubtext: {
    color: '#EEE',
    fontSize: 10,
  },
  recommendedList: {
    gap: 15,
  },
  recommendedCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    gap: 15,
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
