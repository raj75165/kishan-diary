import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { Ionicons } from '@expo/vector-icons';

// ── Backup/Restore Modal ──────────────────────────────────────────────────────

function BackupRestoreModal({ visible, onClose, exportBackup, importBackup }) {
  const [restoreText, setRestoreText] = useState('');
  const [tab, setTab] = useState('backup');
  const backupData = exportBackup();

  const handleRestore = async () => {
    if (!restoreText.trim()) {
      Alert.alert('Error', 'Please paste your backup data.');
      return;
    }
    Alert.alert(
      'Confirm Restore',
      'This will replace ALL existing data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            const result = await importBackup(restoreText.trim());
            if (result.success) {
              Alert.alert('Success', 'Data restored successfully.');
              setRestoreText('');
              onClose();
            } else {
              Alert.alert('Error', result.error || 'Invalid backup data.');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: '85%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Backup & Restore</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Tab bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'backup' && styles.tabBtnActive]}
              onPress={() => setTab('backup')}
            >
              <Text style={[styles.tabBtnText, tab === 'backup' && styles.tabBtnTextActive]}>
                📤 Backup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'restore' && styles.tabBtnActive]}
              onPress={() => setTab('restore')}
            >
              <Text style={[styles.tabBtnText, tab === 'restore' && styles.tabBtnTextActive]}>
                📥 Restore
              </Text>
            </TouchableOpacity>
          </View>

          {tab === 'backup' ? (
            <ScrollView>
              <Text style={styles.backupInfo}>
                Copy the JSON below and save it in a secure place (notes, email, etc.).
              </Text>
              <TextInput
                style={styles.backupTextArea}
                value={backupData}
                multiline
                editable={false}
                scrollEnabled
              />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={styles.backupInfo}>
                Paste your previously exported backup JSON below and tap Restore.
              </Text>
              <TextInput
                style={[styles.backupTextArea, { color: '#1a1a1a' }]}
                value={restoreText}
                onChangeText={setRestoreText}
                multiline
                placeholder="Paste backup JSON here…"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
                <Text style={styles.restoreBtnText}>Restore Data</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { farmers, workLogs, expenses, exportBackup, importBackup } = useAppData();
  const [showBackup, setShowBackup] = useState(false);

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

  const totalRevenue = workLogs.reduce((s, l) => s + (l.totalAmount || 0), 0);
  const totalExpensesAmt = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
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

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistics</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Farmers Registered:</Text>
              <Text style={styles.statValue}>{farmers.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Work Logs:</Text>
              <Text style={styles.statValue}>{workLogs.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Revenue:</Text>
              <Text style={styles.statValue}>₹{totalRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Expenses:</Text>
              <Text style={[styles.statValue, { color: '#d32f2f' }]}>
                ₹{totalExpensesAmt.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Net Profit:</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: totalRevenue - totalExpensesAmt >= 0 ? '#388e3c' : '#d32f2f' },
                ]}
              >
                ₹{(totalRevenue - totalExpensesAmt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact info */}
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

        {/* Data management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗄️ Data Management</Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowBackup(true)}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="cloud-upload-outline" size={22} color="#2d5016" />
              <Text style={styles.actionText}>Backup & Restore Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>Kishan Diary v1.0.0</Text>
            <Text style={styles.aboutText}>Your complete farm management solution</Text>
          </View>
        </View>
      </ScrollView>

      <BackupRestoreModal
        visible={showBackup}
        onClose={() => setShowBackup(false)}
        exportBackup={exportBackup}
        importBackup={importBackup}
      />
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

  // Action row
  actionRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 15, color: '#1a1a1a', marginLeft: 10, fontWeight: '500' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: { backgroundColor: '#fff', elevation: 1 },
  tabBtnText: { fontSize: 14, color: '#888', fontWeight: '500' },
  tabBtnTextActive: { color: '#2d5016', fontWeight: '700' },

  // Backup
  backupInfo: { fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 18 },
  backupTextArea: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    fontSize: 11,
    color: '#555',
    minHeight: 180,
    fontFamily: 'monospace',
  },
  restoreBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  restoreBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: { color: '#555', fontSize: 14, fontWeight: '600' },
});
