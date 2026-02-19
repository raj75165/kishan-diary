import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../context/AppDataContext';

// ── Invoice Modal ─────────────────────────────────────────────────────────────

function InvoiceModal({ visible, farmer, onClose, appData }) {
  const logs = appData.getWorkLogsByFarmer(farmer?.id);
  const balance = appData.getFarmerBalance(farmer?.id);
  const unpaid = logs.filter((l) => (l.amountPaid || 0) < (l.totalAmount || 0));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invoice</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Farmer info */}
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceFarmer}>{farmer?.name}</Text>
              <Text style={styles.invoiceDetail}>📞 {farmer?.phone || 'N/A'}</Text>
              <Text style={styles.invoiceDetail}>🏡 {farmer?.village || 'N/A'}</Text>
              <Text style={styles.invoiceDate}>
                Date: {new Date().toLocaleDateString('en-IN')}
              </Text>
            </View>

            {/* Work log items */}
            <Text style={styles.invoiceSectionTitle}>Work Details</Text>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No work logs found.</Text>
            ) : (
              logs.map((log) => (
                <View key={log.id} style={styles.invoiceRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceItemName}>{log.implementName}</Text>
                    <Text style={styles.invoiceItemSub}>
                      {log.date} | {log.acres ? `${log.acres} acres` : `${log.hours} hrs`}
                    </Text>
                  </View>
                  <Text style={styles.invoiceAmount}>₹{log.totalAmount}</Text>
                </View>
              ))
            )}

            {/* Summary */}
            <View style={styles.invoiceSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryValue}>₹{balance.total}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid:</Text>
                <Text style={[styles.summaryValue, { color: '#388e3c' }]}>₹{balance.paid}</Text>
              </View>
              <View style={[styles.summaryRow, styles.balanceDueRow]}>
                <Text style={styles.balanceDueLabel}>Balance Due:</Text>
                <Text style={styles.balanceDueValue}>₹{balance.due}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Farmer Detail Modal ───────────────────────────────────────────────────────

function FarmerDetailModal({ visible, farmer, onClose, appData }) {
  const logs = appData.getWorkLogsByFarmer(farmer?.id);
  const balance = appData.getFarmerBalance(farmer?.id);
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: '92%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{farmer?.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Contact */}
            <View style={styles.detailInfoCard}>
              {farmer?.phone ? (
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={16} color="#2d5016" />
                  <Text style={styles.infoText}>{farmer.phone}</Text>
                </View>
              ) : null}
              {farmer?.village ? (
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={16} color="#2d5016" />
                  <Text style={styles.infoText}>{farmer.village}</Text>
                </View>
              ) : null}
              {farmer?.totalArea ? (
                <View style={styles.infoRow}>
                  <Ionicons name="resize" size={16} color="#2d5016" />
                  <Text style={styles.infoText}>{farmer.totalArea} acres total</Text>
                </View>
              ) : null}
            </View>

            {/* Financial summary */}
            <View style={styles.financeSummary}>
              <View style={styles.financeItem}>
                <Text style={styles.financeValue}>₹{balance.total}</Text>
                <Text style={styles.financeLabel}>Total Billed</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeValue, { color: '#388e3c' }]}>₹{balance.paid}</Text>
                <Text style={styles.financeLabel}>Paid</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeValue, { color: '#d32f2f' }]}>₹{balance.due}</Text>
                <Text style={styles.financeLabel}>Due</Text>
              </View>
            </View>

            {/* Work logs */}
            <Text style={styles.sectionTitle}>Work History ({logs.length})</Text>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No work logs yet.</Text>
            ) : (
            logs
                .slice()
                .reverse()
                .map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logImplement}>{log.implementName}</Text>
                      <Text style={styles.logDate}>{log.date}</Text>
                      <Text style={styles.logMeta}>
                        {log.acres ? `${log.acres} acres` : `${log.hours} hrs`}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.logAmount}>₹{log.totalAmount}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              (log.amountPaid || 0) >= log.totalAmount
                                ? '#e8f5e9'
                                : '#fff3e0',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                (log.amountPaid || 0) >= log.totalAmount
                                  ? '#388e3c'
                                  : '#f57c00',
                            },
                          ]}
                        >
                          {(log.amountPaid || 0) >= log.totalAmount ? 'Paid' : 'Due'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.invoiceBtn}
            onPress={() => setShowInvoice(true)}
          >
            <Ionicons name="document-text" size={18} color="#fff" />
            <Text style={styles.invoiceBtnText}>Generate Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      <InvoiceModal
        visible={showInvoice}
        farmer={farmer}
        onClose={() => setShowInvoice(false)}
        appData={appData}
      />
    </Modal>
  );
}

// ── Add Farmer Modal ──────────────────────────────────────────────────────────

function AddFarmerModal({ visible, onClose, onSave }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setName('');
    setPhone('');
    setVillage('');
    setTotalArea('');
    setNotes('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Farmer name is required.');
      return;
    }
    onSave({ name: name.trim(), phone, village, totalArea, notes });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Farmer</Text>
            <TouchableOpacity
              onPress={() => {
                reset();
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Farmer's full name"
              placeholderTextColor="#aaa"
            />
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Mobile number"
              keyboardType="phone-pad"
              placeholderTextColor="#aaa"
            />
            <Text style={styles.fieldLabel}>Village / Location</Text>
            <TextInput
              style={styles.input}
              value={village}
              onChangeText={setVillage}
              placeholder="Village name"
              placeholderTextColor="#aaa"
            />
            <Text style={styles.fieldLabel}>Total Farm Area (acres)</Text>
            <TextInput
              style={styles.input}
              value={totalArea}
              onChangeText={setTotalArea}
              placeholder="e.g. 5"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes"
              multiline
              placeholderTextColor="#aaa"
            />
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Farmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function FarmersScreen() {
  const appData = useAppData();
  const { farmers, deleteFarmer, addFarmer, getFarmerBalance } = appData;

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const filtered = useMemo(
    () =>
      farmers.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          (f.village || '').toLowerCase().includes(search.toLowerCase())
      ),
    [farmers, search]
  );

  const handleDelete = (farmer) => {
    Alert.alert('Delete Farmer', `Remove ${farmer.name} and all their records?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteFarmer(farmer.id),
      },
    ]);
  };

  const renderFarmer = ({ item }) => {
    const balance = getFarmerBalance(item.id);
    return (
      <TouchableOpacity
        style={styles.farmerCard}
        onPress={() => setSelectedFarmer(item)}
        activeOpacity={0.8}
      >
        <View style={styles.farmerAvatar}>
          <Text style={styles.farmerAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{item.name}</Text>
          <Text style={styles.farmerSub}>
            {item.village ? `📍 ${item.village}` : ''}
            {item.phone ? `  📞 ${item.phone}` : ''}
          </Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>Due: </Text>
            <Text
              style={[
                styles.balanceAmount,
                { color: balance.due > 0 ? '#d32f2f' : '#388e3c' },
              ]}
            >
              ₹{balance.due}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or village…"
          placeholderTextColor="#aaa"
        />
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👨‍🌾</Text>
          <Text style={styles.emptyTitle}>No Farmers Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first farmer to start tracking work and invoices.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderFarmer}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddFarmerModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addFarmer}
      />

      {selectedFarmer && (
        <FarmerDetailModal
          visible={!!selectedFarmer}
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          appData={appData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  // Farmer card
  farmerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  farmerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  farmerAvatarText: { fontSize: 20, color: '#2d5016', fontWeight: 'bold' },
  farmerInfo: { flex: 1 },
  farmerName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  farmerSub: { fontSize: 12, color: '#777', marginTop: 2 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  balanceText: { fontSize: 12, color: '#555' },
  balanceAmount: { fontSize: 13, fontWeight: '700' },
  deleteBtn: { padding: 4 },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center' },

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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },

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

  // Farmer detail
  detailInfoCard: {
    backgroundColor: '#f7faf7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#444', marginLeft: 8 },
  financeSummary: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  financeItem: { flex: 1, alignItems: 'center' },
  financeValue: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  financeLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#2d5016', marginBottom: 8 },
  logCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logImplement: { fontSize: 14, fontWeight: '600', color: '#333' },
  logDate: { fontSize: 12, color: '#888' },
  logMeta: { fontSize: 12, color: '#555' },
  logAmount: { fontSize: 15, fontWeight: '700', color: '#2d5016' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  invoiceBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  invoiceBtnText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  emptyText: { fontSize: 13, color: '#999', textAlign: 'center', marginVertical: 10 },

  // Invoice
  invoiceHeader: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  invoiceFarmer: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  invoiceDetail: { fontSize: 13, color: '#555', marginBottom: 2 },
  invoiceDate: { fontSize: 12, color: '#888', marginTop: 4 },
  invoiceSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 8,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  invoiceItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  invoiceItemSub: { fontSize: 12, color: '#888' },
  invoiceAmount: { fontSize: 15, fontWeight: '700', color: '#2d5016' },
  invoiceSummary: {
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, color: '#555' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  balanceDueRow: {
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2',
    paddingTop: 8,
    marginTop: 4,
  },
  balanceDueLabel: { fontSize: 15, fontWeight: '700', color: '#e65100' },
  balanceDueValue: { fontSize: 16, fontWeight: '800', color: '#e65100' },
});
