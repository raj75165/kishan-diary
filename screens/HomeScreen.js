import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to Kishan Diary</Text>
        <Text style={styles.subtitle}>Your Farm Management Companion</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Today's Overview</Text>
          <Text style={styles.cardText}>• Total Implements: 0</Text>
          <Text style={styles.cardText}>• Active Work Logs: 0</Text>
          <Text style={styles.cardText}>• Pending Tasks: 0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌾 Quick Actions</Text>
          <Text style={styles.cardText}>• Add new implement</Text>
          <Text style={styles.cardText}>• Log work activity</Text>
          <Text style={styles.cardText}>• View reports</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Track your farm implements, log daily work activities, and manage your agricultural operations efficiently.
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2d5016',
    lineHeight: 20,
    textAlign: 'center',
  },
});
