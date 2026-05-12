import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

// Mock data for destination summary
const DESTINATIONS = {
  '1': { name: 'Bora Bora', price: 1200 },
  '2': { name: 'Swiss Alps', price: 950 },
  '3': { name: 'Tokyo', price: 800 },
};

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState('Oct 12 - Oct 17, 2024');
  
  const destination = DESTINATIONS[id as keyof typeof DESTINATIONS] || DESTINATIONS['1'];
  const totalPrice = (adults * destination.price) + (children * (destination.price * 0.7));

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: Colors[colorScheme].border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={28} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>Booking Details</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Destination Summary Card */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].muted }]}>
          <ThemedText style={styles.cardLabel}>Destination</ThemedText>
          <ThemedText type="title" style={styles.destinationName}>{destination.name}</ThemedText>
        </View>

        {/* Date Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="calendar-today" size={20} color={Colors[colorScheme].tint} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Select Dates</ThemedText>
          </View>
          <TouchableOpacity style={[styles.dateSelector, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].background }]}>
            <ThemedText style={styles.dateText}>{selectedDate}</ThemedText>
            <IconSymbol name="edit" size={18} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
        </View>

        {/* Travelers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="person" size={20} color={Colors[colorScheme].tint} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Travelers</ThemedText>
          </View>
          
          {/* Adults */}
          <View style={[styles.travelerRow, { backgroundColor: Colors[colorScheme].muted }]}>
            <View>
              <ThemedText type="defaultSemiBold">Adults</ThemedText>
              <ThemedText style={styles.travelerSub}>Age 13+</ThemedText>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: Colors[colorScheme].background }]}
                onPress={() => setAdults(Math.max(1, adults - 1))}
              >
                <ThemedText style={styles.counterBtnText}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.counterValue}>{adults}</ThemedText>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: Colors[colorScheme].tint }]}
                onPress={() => setAdults(adults + 1)}
              >
                <ThemedText style={[styles.counterBtnText, { color: '#FFF' }]}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Children */}
          <View style={[styles.travelerRow, { backgroundColor: Colors[colorScheme].muted }]}>
            <View>
              <ThemedText type="defaultSemiBold">Children</ThemedText>
              <ThemedText style={styles.travelerSub}>Age 2-12</ThemedText>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: Colors[colorScheme].background }]}
                onPress={() => setChildren(Math.max(0, children - 1))}
              >
                <ThemedText style={styles.counterBtnText}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.counterValue}>{children}</ThemedText>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: Colors[colorScheme].tint }]}
                onPress={() => setChildren(children + 1)}
              >
                <ThemedText style={[styles.counterBtnText, { color: '#FFF' }]}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={[styles.priceBreakdown, { borderTopColor: Colors[colorScheme].border }]}>
          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Adults ({adults} x ${destination.price})</ThemedText>
            <ThemedText>${adults * destination.price}</ThemedText>
          </View>
          {children > 0 && (
            <View style={styles.priceRow}>
              <ThemedText style={styles.priceLabel}>Children ({children} x ${destination.price * 0.7})</ThemedText>
              <ThemedText>${Math.round(children * (destination.price * 0.7))}</ThemedText>
            </View>
          )}
          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Service Fee</ThemedText>
            <ThemedText>$45</ThemedText>
          </View>
          <View style={[styles.totalRow, { borderTopColor: Colors[colorScheme].border }]}>
            <ThemedText type="subtitle">Total Amount</ThemedText>
            <ThemedText type="title" style={{ color: Colors[colorScheme].tint }}>${totalPrice + 45}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { backgroundColor: Colors[colorScheme].background }]}>
        <TouchableOpacity 
          style={[styles.confirmButton, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={() => {
            alert('Booking Successful!');
            router.replace('/(tabs)');
          }}
        >
          <ThemedText style={styles.confirmButtonText}>Confirm Booking</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  cardLabel: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
  },
  dateSelector: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
  },
  travelerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  travelerSub: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  priceBreakdown: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    opacity: 0.6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  confirmButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3A86FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
