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

// ── Add Work Log Modal ────────────────────────────────────────────────────────

function AddWorkLogModal({ visible, onClose, onSave, farmers, implements: implList }) {
  const [farmerId, setFarmerId] = useState('');
  const [implementId, setImplementId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [acres, setAcres] = useState('');
  const [hours, setHours] = useState('');
  const [ratePerAcre, setRatePerAcre] = useState('');
  const [amountPaid, setAmountPaid] = useState('0');
  const [notes, setNotes] = useState('');

  const [farmerSearch, setFarmerSearch] = useState('');
  const [showFarmerPicker, setShowFarmerPicker] = useState(false);
  const [showImplPicker, setShowImplPicker] = useState(false);

  const selectedFarmer = farmers.find((f) => f.id === farmerId);
  const selectedImpl = implList.find((i) => i.id === implementId);

  const totalAmount = useMemo(() => {
    if (acres && ratePerAcre) return (Number(acres) * Number(ratePerAcre)).toFixed(0);
    return '0';
  }, [acres, ratePerAcre]);

  const handleSelectImpl = (impl) => {
    setImplementId(impl.id);
    setRatePerAcre(String(impl.defaultRatePerAcre || ''));
    setShowImplPicker(false);
  };

  const reset = () => {
    setFarmerId('');
    setImplementId('');
    setDate(new Date().toISOString().slice(0, 10));
    setAcres('');
    setHours('');
    setRatePerAcre('');
    setAmountPaid('0');
    setNotes('');
    setFarmerSearch('');
  };

  const handleSave = () => {
    if (!farmerId) { Alert.alert('Validation', 'Please select a farmer.'); return; }
    if (!implementId) { Alert.alert('Validation', 'Please select an implement.'); return; }
    if (!acres && !hours) { Alert.alert('Validation', 'Enter acres or hours.'); return; }

    onSave({
      farmerId,
      farmerName: selectedFarmer?.name || '',
      implementId,
      implementName: selectedImpl?.name || '',
      date,
      acres: Number(acres) || 0,
      hours: Number(hours) || 0,
      ratePerAcre: Number(ratePerAcre) || 0,
      totalAmount: Number(totalAmount),
      amountPaid: Number(amountPaid) || 0,
      notes,
    });
    reset();
    onClose();
  };

  const filteredFarmers = farmerSearch
    ? farmers.filter((f) =>
        f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        (f.village || '').toLowerCase().includes(farmerSearch.toLowerCase())
      )
    : farmers;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Work Log</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Farmer picker */}
            <Text style={styles.fieldLabel}>Farmer *</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowFarmerPicker(true)}
            >
              <Text style={selectedFarmer ? styles.pickerValue : styles.pickerPlaceholder}>
                {selectedFarmer ? selectedFarmer.name : 'Select farmer…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </TouchableOpacity>

            {/* Implement picker */}
            <Text style={styles.fieldLabel}>Implement *</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowImplPicker(true)}
            >
              <Text style={selectedImpl ? styles.pickerValue : styles.pickerPlaceholder}>
                {selectedImpl ? `${selectedImpl.icon} ${selectedImpl.name}` : 'Select implement…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>Acres</Text>
                <TextInput
                  style={styles.input}
                  value={acres}
                  onChangeText={setAcres}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Hours</Text>
                <TextInput
                  style={styles.input}
                  value={hours}
                  onChangeText={setHours}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Rate per Acre (₹)</Text>
            <TextInput
              style={styles.input}
              value={ratePerAcre}
              onChangeText={setRatePerAcre}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />

            {/* Total */}
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{totalAmount}</Text>
            </View>

            <Text style={styles.fieldLabel}>Amount Paid (₹)</Text>
            <TextInput
              style={styles.input}
              value={amountPaid}
              onChangeText={setAmountPaid}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any notes…"
              multiline
              placeholderTextColor="#aaa"
            />
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Work Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Farmer picker sheet */}
      <Modal visible={showFarmerPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Farmer</Text>
              <TouchableOpacity onPress={() => setShowFarmerPicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              value={farmerSearch}
              onChangeText={setFarmerSearch}
              placeholder="Search farmer…"
              placeholderTextColor="#aaa"
            />
            <FlatList
              data={filteredFarmers}
              keyExtractor={(f) => f.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => { setFarmerId(item.id); setShowFarmerPicker(false); }}
                >
                  <Text style={styles.pickerItemText}>{item.name}</Text>
                  {item.village ? (
                    <Text style={styles.pickerItemSub}>{item.village}</Text>
                  ) : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No farmers found. Add farmers first.</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Implement picker sheet */}
      <Modal visible={showImplPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Implement</Text>
              <TouchableOpacity onPress={() => setShowImplPicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={implList}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => handleSelectImpl(item)}
                >
                  <Text style={styles.pickerItemIcon}>{item.icon}</Text>
                  <View>
                    <Text style={styles.pickerItemText}>{item.name}</Text>
                    <Text style={styles.pickerItemSub}>
                      ₹{item.defaultRatePerAcre}/acre default
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// ── Payment Update Modal ──────────────────────────────────────────────────────

function PaymentModal({ visible, log, onClose, onSave }) {
  const [amount, setAmount] = useState('');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { padding: 24 }]}>
          <Text style={styles.modalTitle}>Record Payment</Text>
          <Text style={styles.paymentInfo}>
            {log?.farmerName} – {log?.implementName}
          </Text>
          <Text style={styles.paymentInfo}>
            Total: ₹{log?.totalAmount}  |  Paid: ₹{log?.amountPaid || 0}
          </Text>
          <Text style={styles.paymentInfo}>
            Due: ₹{(log?.totalAmount || 0) - (log?.amountPaid || 0)}
          </Text>
          <Text style={styles.fieldLabel}>Amount Received (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            autoFocus
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              const newPaid = (log?.amountPaid || 0) + Number(amount);
              onSave(log?.id, { amountPaid: newPaid });
              setAmount('');
              onClose();
            }}
          >
            <Text style={styles.saveBtnText}>Confirm Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function WorkLogScreen() {
  const { farmers, implements: implList, workLogs, addWorkLog, updateWorkLog, deleteWorkLog } =
    useAppData();

  const [showAdd, setShowAdd] = useState(false);
  const [paymentLog, setPaymentLog] = useState(null);
  const [filterFarmer, setFilterFarmer] = useState('all');

  const sorted = useMemo(
    () =>
      workLogs
        .filter((l) => filterFarmer === 'all' || l.farmerId === filterFarmer)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [workLogs, filterFarmer]
  );

  const handleDelete = (log) => {
    Alert.alert('Delete Work Log', 'Remove this work log entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteWorkLog(log.id) },
    ]);
  };

  const renderLog = ({ item }) => {
    const paid = item.amountPaid || 0;
    const due = (item.totalAmount || 0) - paid;
    const isPaid = due <= 0;

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <View style={styles.logHeaderLeft}>
            <Text style={styles.logFarmer}>{item.farmerName}</Text>
            <Text style={styles.logImpl}>{item.implementName}</Text>
          </View>
          <View style={styles.logHeaderRight}>
            <Text style={styles.logAmount}>₹{item.totalAmount}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPaid ? '#e8f5e9' : '#fff3e0' },
              ]}
            >
              <Text style={[styles.statusText, { color: isPaid ? '#388e3c' : '#f57c00' }]}>
                {isPaid ? '✓ Paid' : `Due ₹${due}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.logMeta}>
          <Text style={styles.logMetaText}>📅 {item.date}</Text>
          {item.acres ? <Text style={styles.logMetaText}>🌾 {item.acres} acres</Text> : null}
          {item.hours ? <Text style={styles.logMetaText}>⏱ {item.hours} hrs</Text> : null}
          {item.ratePerAcre ? (
            <Text style={styles.logMetaText}>₹{item.ratePerAcre}/acre</Text>
          ) : null}
        </View>

        <View style={styles.logActions}>
          {!isPaid && (
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => setPaymentLog(item)}
            >
              <Ionicons name="cash-outline" size={15} color="#fff" />
              <Text style={styles.payBtnText}>Record Payment</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.delBtn}
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Farmer filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[styles.filterChip, filterFarmer === 'all' && styles.filterChipActive]}
          onPress={() => setFilterFarmer('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              filterFarmer === 'all' && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {farmers.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, filterFarmer === f.id && styles.filterChipActive]}
            onPress={() => setFilterFarmer(f.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterFarmer === f.id && styles.filterChipTextActive,
              ]}
            >
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {sorted.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Work Logs Yet</Text>
          <Text style={styles.emptySubtitle}>
            {farmers.length === 0
              ? 'Add farmers first, then log work activities.'
              : 'Tap + to add your first work log.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderLog}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddWorkLogModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addWorkLog}
        farmers={farmers}
        implements={implList}
      />

      <PaymentModal
        visible={!!paymentLog}
        log={paymentLog}
        onClose={() => setPaymentLog(null)}
        onSave={updateWorkLog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Filter
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, flexGrow: 0 },
  filterChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: '#2d5016', borderColor: '#2d5016' },
  filterChipText: { fontSize: 12, color: '#555' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },

  // Log card
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logHeaderLeft: { flex: 1 },
  logHeaderRight: { alignItems: 'flex-end' },
  logFarmer: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  logImpl: { fontSize: 13, color: '#555', marginTop: 2 },
  logAmount: { fontSize: 16, fontWeight: '700', color: '#2d5016' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  logMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  logMetaText: { fontSize: 12, color: '#777' },
  logActions: { flexDirection: 'row', alignItems: 'center' },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565c0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
  },
  payBtnText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  delBtn: { marginLeft: 'auto' },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  paymentInfo: { fontSize: 14, color: '#555', marginBottom: 4 },

  // Form
  fieldLabel: { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 10 },
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
  row: { flexDirection: 'row' },
  pickerBtn: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerValue: { fontSize: 14, color: '#333' },
  pickerPlaceholder: { fontSize: 14, color: '#aaa' },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemIcon: { fontSize: 22, marginRight: 10 },
  pickerItemText: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  pickerItemSub: { fontSize: 12, color: '#888' },

  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  totalLabel: { fontSize: 14, color: '#2d5016', fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#2d5016' },

  saveBtn: {
    backgroundColor: '#2d5016',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: { color: '#555', fontSize: 14, fontWeight: '600' },
  emptyText: { fontSize: 13, color: '#999', textAlign: 'center', marginVertical: 10 },
});
