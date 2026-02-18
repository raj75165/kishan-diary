import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍🌾</Text>
          </View>
          <Text style={styles.name}>Farm Owner</Text>
          <Text style={styles.email}>farmer@kishendiary.com</Text>
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
});
