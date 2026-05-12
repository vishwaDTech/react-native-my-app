import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isDarkMode = colorScheme === 'dark';

  const handleLogout = async () => {
    await logout();
    // Redirection is handled automatically by _layout.tsx
  };

  const ProfileItem = ({ icon, title, value, onPress, showArrow = true }: any) => (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: Colors[colorScheme].border }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].muted }]}>
          <IconSymbol name={icon} size={20} color={Colors[colorScheme].tint} />
        </View>
        <ThemedText style={styles.itemTitle}>{title}</ThemedText>
      </View>
      <View style={styles.itemRight}>
        {value && <ThemedText style={styles.itemValue}>{value}</ThemedText>}
        {showArrow && <IconSymbol name="chevron.right" size={18} color={Colors[colorScheme].icon} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={[styles.editAvatar, { backgroundColor: Colors[colorScheme].tint }]}>
              <IconSymbol name="edit" size={12} color="#FFF" />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.userName}>{user?.name || 'User'}</ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email || 'guest@travel.com'}</ThemedText>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">12</ThemedText>
              <ThemedText style={styles.statLabel}>Bookings</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: Colors[colorScheme].border }]} />
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">4</ThemedText>
              <ThemedText style={styles.statLabel}>Reviews</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: Colors[colorScheme].border }]} />
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">28</ThemedText>
              <ThemedText style={styles.statLabel}>Photos</ThemedText>
            </View>
          </View>
        </View>

        {/* Booking History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Booking</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: Colors[colorScheme].tint, fontSize: 14 }}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.bookingCard, { backgroundColor: Colors[colorScheme].muted }]}>
            <View style={styles.bookingIcon}>
              <IconSymbol name="history" size={24} color={Colors[colorScheme].tint} />
            </View>
            <View style={styles.bookingInfo}>
              <ThemedText type="defaultSemiBold">Swiss Alps Trip</ThemedText>
              <ThemedText style={styles.bookingDate}>Oct 12 - Oct 17, 2024</ThemedText>
            </View>
            <View style={styles.statusBadge}>
              <ThemedText style={styles.statusText}>Completed</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Groups */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.groupTitle}>Account Settings</ThemedText>
          <View style={[styles.group, { backgroundColor: Colors[colorScheme].muted }]}>
            <ProfileItem icon="person-outline" title="Personal Information" />
            <ProfileItem icon="security" title="Security & Password" />
            <ProfileItem icon="notifications-none" title="Notifications" value="On" />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.groupTitle}>Preferences</ThemedText>
          <View style={[styles.group, { backgroundColor: Colors[colorScheme].muted }]}>
            <View style={[styles.item, { borderBottomWidth: 0 }]}>
              <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].muted }]}>
                  <IconSymbol name="dark-mode" size={20} color={Colors[colorScheme].tint} />
                </View>
                <ThemedText style={styles.itemTitle}>Dark Mode</ThemedText>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={toggleTheme}
                trackColor={{ false: '#CBD5E1', true: Colors[colorScheme].tint }}
              />

            </View>
            <ProfileItem icon="help-outline" title="Help & Support" />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: '#FF3B30' }]} 
          onPress={handleLogout}
        >
          <IconSymbol name="logout" size={20} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    marginBottom: 12,
    opacity: 0.7,
  },
  group: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 14,
    opacity: 0.5,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  bookingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(58, 134, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  statusText: {
    fontSize: 10,
    color: '#34C759',
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});
