import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WorkLogScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Work Logs</Text>
        <Text style={styles.subtitle}>Track your daily farm activities</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Work Logs Yet</Text>
          <Text style={styles.emptyText}>
            Start documenting your farm work by creating your first log entry.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 Log Your Activities:</Text>
          <Text style={styles.infoText}>• Date and time of work</Text>
          <Text style={styles.infoText}>• Type of activity (plowing, harvesting, etc.)</Text>
          <Text style={styles.infoText}>• Implements used</Text>
          <Text style={styles.infoText}>• Area covered or hours spent</Text>
          <Text style={styles.infoText}>• Notes and observations</Text>
          <Text style={styles.infoText}>• Weather conditions</Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Tip: Regular logging helps you track productivity and plan better for next season!
          </Text>
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
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#fff9c4',
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#f57f17',
    lineHeight: 20,
  },
});
