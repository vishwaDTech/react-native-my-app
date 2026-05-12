import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications(notifications.map((n: any) => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard, 
        { backgroundColor: item.read ? Colors[colorScheme].muted : Colors[colorScheme].tint + '10' }
      ]}
      onPress={() => markAsRead(item._id)}
    >
      <View style={[styles.iconBox, { backgroundColor: item.read ? '#CBD5E1' : Colors[colorScheme].tint }]}>
        <IconSymbol name="notifications" size={20} color="#FFF" />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="defaultSemiBold" style={[styles.title, { color: item.read ? Colors[colorScheme].text : Colors[colorScheme].tint }]}>
            {item.title}
          </ThemedText>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <ThemedText style={styles.message}>{item.message}</ThemedText>
        <ThemedText style={styles.time}>{new Date(item.createdAt).toLocaleString()}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="title">Notifications</ThemedText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <IconSymbol name="notifications-off" size={60} color={Colors[colorScheme].icon} />
          <ThemedText style={styles.emptyText}>No notifications yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
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
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backBtn: {
    padding: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
    gap: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    gap: 15,
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A86FF',
  },
  message: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  time: {
    fontSize: 11,
    opacity: 0.4,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.5,
    marginTop: 20,
  }
});
