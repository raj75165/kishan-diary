import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍🌾</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || 'Farm Owner'}</Text>
          <Text style={styles.email}>{user?.email || 'farmer@kishendiary.com'}</Text>
          {user?.farmName && (
            <View style={styles.farmBadge}>
              <Ionicons name="home" size={16} color="#2d5016" />
              <Text style={styles.farmName}>{user.farmName}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistics</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Implements:</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Work Logs:</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Days Active:</Text>
              <Text style={styles.statValue}>1</Text>
            </View>
          </View>
        </View>

        {user?.phone && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color="#2d5016" />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
            {user?.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color="#2d5016" />
                <Text style={styles.infoText}>{user.location}</Text>
              </View>
            )}
            {user?.farmSize && (
              <View style={styles.infoRow}>
                <Ionicons name="resize" size={18} color="#2d5016" />
                <Text style={styles.infoText}>{user.farmSize}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <View style={styles.card}>
            <Text style={styles.menuItem}>• Profile Settings</Text>
            <Text style={styles.menuItem}>• Notification Preferences</Text>
            <Text style={styles.menuItem}>• Data Backup & Sync</Text>
            <Text style={styles.menuItem}>• Language & Region</Text>
            <Text style={styles.menuItem}>• Privacy & Security</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              Kishan Diary v1.0.0
            </Text>
            <Text style={styles.aboutText}>
              Your complete farm management solution
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  farmName: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '600',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
  menuItem: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
