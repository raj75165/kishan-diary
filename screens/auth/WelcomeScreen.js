import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: 'people', color: '#4caf50', label: 'Manage\nFarmers' },
  { icon: 'construct', color: '#ff9800', label: 'Track\nImplements' },
  { icon: 'document-text', color: '#2196f3', label: 'Log\nWork' },
  { icon: 'cash', color: '#9c27b0', label: 'Record\nExpenses' },
  { icon: 'receipt', color: '#f44336', label: 'Generate\nInvoices' },
  { icon: 'cloud-upload', color: '#00bcd4', label: 'Backup\nData' },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b3d0a" />

      {/* Hero section */}
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🌾</Text>
        </View>
        <Text style={styles.appName}>Kishan Diary</Text>
        <Text style={styles.tagline}>Custom Hiring Centre Manager</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={14} color="#a5d6a7" />
            <Text style={styles.badgeText}>Free to use</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color="#a5d6a7" />
            <Text style={styles.badgeText}>Data stays on device</Text>
          </View>
        </View>
      </View>

      {/* Features grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Everything you need</Text>
        <View style={styles.grid}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureCard}>
              <View style={[styles.featureIconBg, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon} size={26} color={f.color} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA buttons */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started Free</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={20} color="#2d5016" />
          <Text style={styles.secondaryButtonText}>Sign In to Existing Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },

  // Hero
  hero: {
    backgroundColor: '#2d5016',
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: { fontSize: 48 },
  appName: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: '#c8e6c9', marginTop: 6, letterSpacing: 0.3 },
  badgeRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  badgeText: { color: '#c8e6c9', fontSize: 12 },

  // Features
  featuresSection: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 12 },
  featuresTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  featureCard: {
    width: (width - 68) / 3,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: { fontSize: 11, color: '#444', textAlign: 'center', fontWeight: '500' },

  // CTA
  ctaSection: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 },
  primaryButton: {
    backgroundColor: '#2d5016',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#2d5016',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#2d5016',
  },
  secondaryButtonText: { color: '#2d5016', fontSize: 16, fontWeight: '600' },
});

