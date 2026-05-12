import React from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/context/FavoritesContext';
import { ALL_DESTINATIONS } from '@/constants/Destinations';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { favorites } = useFavorites();
  const router = useRouter();

  const favoriteDestinations = ALL_DESTINATIONS.filter((d) => favorites.includes(d.id));

  const renderFavoriteItem = ({ item }: { item: typeof ALL_DESTINATIONS[0] }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: Colors[colorScheme].muted }]}
      onPress={() => router.push(`/destination/${item.id}`)}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold" style={styles.name}>{item.name}</ThemedText>
          <View style={styles.ratingRow}>
            <IconSymbol name="star" size={14} color="#FFBE0B" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          </View>
        </View>
        <View style={styles.locationRow}>
          <IconSymbol name="location-on" size={14} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.locationText}>{item.location}</ThemedText>
        </View>
        <ThemedText style={styles.price}>{item.price}<ThemedText style={styles.priceUnit}>/person</ThemedText></ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.screenHeader}>
        <ThemedText type="title">Favorites</ThemedText>
        <ThemedText style={styles.subtitle}>Your saved dream destinations</ThemedText>
      </View>

      {favoriteDestinations.length > 0 ? (
        <FlatList
          data={favoriteDestinations}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: Colors[colorScheme].muted }]}>
            <IconSymbol name="heart.fill" size={40} color={Colors[colorScheme].icon} />
          </View>
          <ThemedText style={styles.emptyTitle}>No Favorites Yet</ThemedText>
          <ThemedText style={styles.emptySubtitle}>Start exploring and save your favorite places to see them here.</ThemedText>
          <TouchableOpacity 
            style={[styles.exploreBtn, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => router.push('/(tabs)')}
          >
            <ThemedText style={styles.exploreBtnText}>Explore Destinations</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenHeader: {
    marginTop: 20,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    gap: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    opacity: 0.6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A86FF',
  },
  priceUnit: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: 'normal',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
    marginBottom: 30,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
