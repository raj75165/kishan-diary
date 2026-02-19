import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../context/AppDataContext';

// ── Add Implement Modal ───────────────────────────────────────────────────────

function AddImplementModal({ visible, onClose, onSave }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🔧');
  const [defaultRatePerAcre, setDefaultRatePerAcre] = useState('');

  const reset = () => {
    setName('');
    setIcon('🔧');
    setDefaultRatePerAcre('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Implement name is required.');
      return;
    }
    onSave({
      name: name.trim(),
      icon: icon.trim() || '🔧',
      defaultRatePerAcre: Number(defaultRatePerAcre) || 0,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Implement</Text>
            <TouchableOpacity
              onPress={() => {
                reset();
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Disc Harrow"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.fieldLabel}>Icon (emoji)</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={setIcon}
            placeholder="🔧"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.fieldLabel}>Default Rate per Acre (₹)</Text>
          <TextInput
            style={styles.input}
            value={defaultRatePerAcre}
            onChangeText={setDefaultRatePerAcre}
            placeholder="e.g. 400"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Implement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Implement Detail Modal ────────────────────────────────────────────────────

function ImplementDetailModal({ visible, implement, onClose, appData }) {
  const logs = appData.getWorkLogsByImplement(implement?.id);
  const totalAcres = logs.reduce((s, l) => s + (Number(l.acres) || 0), 0);
  const totalRevenue = logs.reduce((s, l) => s + (l.totalAmount || 0), 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: '85%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {implement?.icon} {implement?.name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{logs.length}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalAcres}</Text>
              <Text style={styles.statLabel}>Total Acres</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹{totalRevenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Work History</Text>
          <ScrollView>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No work logged for this implement yet.</Text>
            ) : (
              [...logs]
                .reverse()
                .map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logFarmer}>{log.farmerName}</Text>
                      <Text style={styles.logDate}>{log.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.logMeta}>
                        {log.acres ? `${log.acres} acres` : `${log.hours} hrs`}
                      </Text>
                      <Text style={styles.logAmount}>₹{log.totalAmount}</Text>
                    </View>
                  </View>
                ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ImplementsScreen() {
  const appData = useAppData();
  const { implements: implList, addImplement, getWorkLogsByImplement } = appData;

  const [showAdd, setShowAdd] = useState(false);
  const [selectedImpl, setSelectedImpl] = useState(null);

  const renderImplement = ({ item }) => {
    const logs = getWorkLogsByImplement(item.id);
    const totalAcres = logs.reduce((s, l) => s + (Number(l.acres) || 0), 0);
    const totalRevenue = logs.reduce((s, l) => s + (l.totalAmount || 0), 0);

    return (
      <TouchableOpacity
        style={styles.implCard}
        onPress={() => setSelectedImpl(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.implIcon}>{item.icon}</Text>
        <View style={styles.implInfo}>
          <Text style={styles.implName}>{item.name}</Text>
          <Text style={styles.implRate}>
            ₹{item.defaultRatePerAcre}/acre default rate
          </Text>
        </View>
        <View style={styles.implStats}>
          <Text style={styles.implStatValue}>{logs.length}</Text>
          <Text style={styles.implStatLabel}>jobs</Text>
        </View>
        <View style={styles.implStats}>
          <Text style={styles.implStatValue}>₹{totalRevenue}</Text>
          <Text style={styles.implStatLabel}>earned</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={implList}
        keyExtractor={(item) => item.id}
        renderItem={renderImplement}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.headerText}>
              Tap an implement to view work history and statistics.
            </Text>
            <Text style={styles.headerText}>
              Tap <Text style={{ fontWeight: '700' }}>+</Text> to add a custom implement.
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddImplementModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addImplement}
      />

      {selectedImpl && (
        <ImplementDetailModal
          visible={!!selectedImpl}
          implement={selectedImpl}
          onClose={() => setSelectedImpl(null)}
          appData={appData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  headerCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  headerText: { fontSize: 13, color: '#e65100', marginBottom: 2 },

  // Implement card
  implCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  implIcon: { fontSize: 30, marginRight: 12 },
  implInfo: { flex: 1 },
  implName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  implRate: { fontSize: 12, color: '#888', marginTop: 2 },
  implStats: { alignItems: 'center', marginRight: 14 },
  implStatValue: { fontSize: 15, fontWeight: '700', color: '#2d5016' },
  implStatLabel: { fontSize: 10, color: '#999' },

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
    marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f4f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#2d5016' },
  statLabel: { fontSize: 11, color: '#777', marginTop: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#2d5016', marginBottom: 8 },
  logCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logFarmer: { fontSize: 14, fontWeight: '600', color: '#333' },
  logDate: { fontSize: 12, color: '#888' },
  logMeta: { fontSize: 12, color: '#555' },
  logAmount: { fontSize: 14, fontWeight: '700', color: '#2d5016' },
  emptyText: { fontSize: 13, color: '#999', textAlign: 'center', marginVertical: 12 },

  // Form
  fieldLabel: { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#2d5016',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: { color: '#555', fontSize: 14, fontWeight: '600' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2d5016',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
