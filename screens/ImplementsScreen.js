import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ImplementsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Farm Implements</Text>
        <Text style={styles.subtitle}>Manage your agricultural equipment</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚜</Text>
          <Text style={styles.emptyTitle}>No Implements Yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your farm equipment by adding your first implement.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Track Important Details:</Text>
          <Text style={styles.infoText}>• Equipment name and type</Text>
          <Text style={styles.infoText}>• Purchase date and cost</Text>
          <Text style={styles.infoText}>• Maintenance schedule</Text>
          <Text style={styles.infoText}>• Usage hours and logs</Text>
          <Text style={styles.infoText}>• Location and status</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
});
