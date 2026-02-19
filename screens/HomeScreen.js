import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { farmers, workLogs, expenses } = useAppData();
  const { user } = useAuth();

  const today = new Date().toISOString().slice(0, 10);

  const todayLogs = useMemo(
    () => workLogs.filter((l) => l.date === today),
    [workLogs, today]
  );

  const totalRevenue = useMemo(
    () => workLogs.reduce((s, l) => s + (l.totalAmount || 0), 0),
    [workLogs]
  );

  const totalReceived = useMemo(
    () => workLogs.reduce((s, l) => s + (l.amountPaid || 0), 0),
    [workLogs]
  );

  const totalDue = totalRevenue - totalReceived;

  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const pendingPayments = useMemo(
    () => workLogs.filter((l) => (l.amountPaid || 0) < (l.totalAmount || 0)).length,
    [workLogs]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>
          👋 Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
        </Text>
        <Text style={styles.subtitle}>
          {user?.farmName || 'Kishan Diary'} · Custom Hiring Centre
        </Text>

        {/* Revenue summary */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueValue}>₹{totalRevenue.toLocaleString()}</Text>
            <Text style={styles.revenueLabel}>Total Billed</Text>
          </View>
          <View style={styles.revenueDivider} />
          <View style={styles.revenueItem}>
            <Text style={[styles.revenueValue, { color: '#388e3c' }]}>
              ₹{totalReceived.toLocaleString()}
            </Text>
            <Text style={styles.revenueLabel}>Received</Text>
          </View>
          <View style={styles.revenueDivider} />
          <View style={styles.revenueItem}>
            <Text style={[styles.revenueValue, { color: '#d32f2f' }]}>
              ₹{totalDue.toLocaleString()}
            </Text>
            <Text style={styles.revenueLabel}>Due</Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
            <Text style={styles.statIcon}>👨‍🌾</Text>
            <Text style={styles.statValue}>{farmers.length}</Text>
            <Text style={styles.statLabel}>Farmers</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statValue}>{workLogs.length}</Text>
            <Text style={styles.statLabel}>Work Logs</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}>
            <Text style={styles.statIcon}>⚠️</Text>
            <Text style={[styles.statValue, { color: '#f57c00' }]}>{pendingPayments}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fce4ec' }]}>
            <Text style={styles.statIcon}>💸</Text>
            <Text style={[styles.statValue, { color: '#c62828' }]}>
              ₹{totalExpenses.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
        </View>

        {/* Today's work */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Today's Work ({todayLogs.length} jobs)</Text>
          {todayLogs.length === 0 ? (
            <Text style={styles.cardText}>No work logged today.</Text>
          ) : (
            todayLogs.map((log) => (
              <View key={log.id} style={styles.todayRow}>
                <View>
                  <Text style={styles.todayFarmer}>{log.farmerName}</Text>
                  <Text style={styles.todayImpl}>{log.implementName}</Text>
                </View>
                <Text style={styles.todayAmount}>₹{log.totalAmount}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🌾 Use the tabs below to manage farmers, log work, track expenses and view reports.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },

  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: '#777', marginBottom: 20 },

  // Revenue card
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  revenueItem: { flex: 1, alignItems: 'center' },
  revenueValue: { fontSize: 17, fontWeight: '800', color: '#1a1a1a' },
  revenueLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  revenueDivider: { width: 1, backgroundColor: '#eee' },

  // Stats grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },

  // Today card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#2d5016', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#999' },
  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  todayFarmer: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  todayImpl: { fontSize: 12, color: '#777' },
  todayAmount: { fontSize: 14, fontWeight: '700', color: '#2d5016' },

  infoCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
  },
  infoText: { fontSize: 13, color: '#2d5016', lineHeight: 20, textAlign: 'center' },
});
