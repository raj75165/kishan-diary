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
import { useAppData, EXPENSE_TYPES } from '../context/AppDataContext';

// ── Add Expense Modal ─────────────────────────────────────────────────────────

function AddExpenseModal({ visible, onClose, onSave }) {
  const [type, setType] = useState(EXPENSE_TYPES[0].id);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setType(EXPENSE_TYPES[0].id);
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setNotes('');
  };

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount.');
      return;
    }
    const expType = EXPENSE_TYPES.find((e) => e.id === type);
    onSave({
      type,
      typeName: expType?.name || type,
      typeIcon: expType?.icon || '💼',
      amount: Number(amount),
      date,
      description,
      notes,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Expense</Text>
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
            {/* Type selector */}
            <Text style={styles.fieldLabel}>Expense Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {EXPENSE_TYPES.map((et) => (
                <TouchableOpacity
                  key={et.id}
                  style={[
                    styles.typeChip,
                    type === et.id && styles.typeChipSelected,
                  ]}
                  onPress={() => setType(et.id)}
                >
                  <Text style={styles.typeChipIcon}>{et.icon}</Text>
                  <Text
                    style={[
                      styles.typeChipText,
                      type === et.id && styles.typeChipTextSelected,
                    ]}
                  >
                    {et.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Amount (₹) *</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. 50 litres diesel @ ₹92/L"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes"
              multiline
              placeholderTextColor="#aaa"
            />
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense } = useAppData();
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filtered = useMemo(() => {
    const list = filterType === 'all' ? expenses : expenses.filter((e) => e.type === filterType);
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filterType]);

  const totalByType = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.type] = (map[e.type] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const grandTotal = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const handleDelete = (expense) => {
    Alert.alert('Delete Expense', 'Remove this expense record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpense(expense.id),
      },
    ]);
  };

  const renderExpense = ({ item }) => (
    <View style={styles.expenseCard}>
      <Text style={styles.expenseIcon}>{item.typeIcon}</Text>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseName}>{item.typeName}</Text>
        {item.description ? (
          <Text style={styles.expenseDesc}>{item.description}</Text>
        ) : null}
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.expenseAmount}>₹{item.amount}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
        <View style={[styles.summaryCard, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.summaryAmount}>₹{grandTotal.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
        </View>
        {EXPENSE_TYPES.map((et) =>
          totalByType[et.id] ? (
            <View key={et.id} style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>{et.icon}</Text>
              <Text style={styles.summaryAmount}>₹{(totalByType[et.id] || 0).toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>{et.name}</Text>
            </View>
          ) : null
        )}
      </ScrollView>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {EXPENSE_TYPES.map((et) => (
          <TouchableOpacity
            key={et.id}
            style={[styles.filterChip, filterType === et.id && styles.filterChipActive]}
            onPress={() => setFilterType(et.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterType === et.id && styles.filterChipTextActive,
              ]}
            >
              {et.icon} {et.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💰</Text>
          <Text style={styles.emptyTitle}>No Expenses Yet</Text>
          <Text style={styles.emptySubtitle}>
            Record diesel, tractor service, driver salary and more.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderExpense}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddExpenseModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Summary
  summaryScroll: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 0 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  summaryIcon: { fontSize: 22, marginBottom: 4 },
  summaryAmount: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  summaryLabel: { fontSize: 11, color: '#777', marginTop: 2, textAlign: 'center' },

  // Filter chips
  filterScroll: { paddingHorizontal: 16, marginBottom: 4, flexGrow: 0 },
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

  // Expense card
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  expenseIcon: { fontSize: 28, marginRight: 12 },
  expenseInfo: { flex: 1 },
  expenseName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  expenseDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  expenseDate: { fontSize: 11, color: '#999', marginTop: 2 },
  expenseAmount: { fontSize: 16, fontWeight: '700', color: '#d32f2f', marginBottom: 6 },

  // Empty state
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
    backgroundColor: '#e65100',
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
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },

  // Type chips
  typeChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  typeChipSelected: { backgroundColor: '#e65100', borderColor: '#e65100' },
  typeChipIcon: { fontSize: 20, marginBottom: 2 },
  typeChipText: { fontSize: 11, color: '#555', textAlign: 'center' },
  typeChipTextSelected: { color: '#fff', fontWeight: '600' },

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
    backgroundColor: '#e65100',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
