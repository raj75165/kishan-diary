import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ACTIVITY_TYPES = [
  { key: 'sowing', label: 'Sowing', icon: '🌱', color: '#4caf50' },
  { key: 'cultivation', label: 'Cultivation', icon: '🚜', color: '#ff9800' },
  { key: 'watering', label: 'Watering', icon: '💧', color: '#2196f3' },
  { key: 'fertilizer', label: 'Fertilizer', icon: '🧪', color: '#9c27b0' },
  { key: 'pesticide', label: 'Pesticide', icon: '🛡️', color: '#f44336' },
  { key: 'harvesting', label: 'Harvesting', icon: '🌾', color: '#8d6e63' },
  { key: 'other', label: 'Other', icon: '📝', color: '#607d8b' },
];

const STORAGE_KEY = 'cropActivities';

export default function CropTrackingScreen() {
  const [activities, setActivities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cropName, setCropName] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [activityDate, setActivityDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading crop activities:', error);
    }
  };

  const saveActivity = async () => {
    if (!cropName.trim()) {
      Alert.alert('Required', 'Please enter the crop name.');
      return;
    }
    if (!selectedType) {
      Alert.alert('Required', 'Please select an activity type.');
      return;
    }
    if (!activityDate.trim()) {
      Alert.alert('Required', 'Please enter the date.');
      return;
    }
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = activityDate.trim().match(datePattern);
    if (!match) {
      Alert.alert('Invalid Date', 'Please enter the date in DD/MM/YYYY format (e.g. 20/02/2026).');
      return;
    }
    const [, day, month, year] = match.map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      Alert.alert('Invalid Date', 'Please enter a valid date.');
      return;
    }

    const newActivity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      cropName: cropName.trim(),
      activityType: selectedType,
      date: activityDate.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newActivity, ...activities];
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setActivities(updated);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Could not save the activity. Please try again.');
    }
  };

  const deleteActivity = (id) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = activities.filter((a) => a.id !== id);
            try {
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              setActivities(updated);
            } catch (error) {
              Alert.alert('Error', 'Could not delete the activity.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setCropName('');
    setSelectedType(null);
    setActivityDate('');
    setNotes('');
    setModalVisible(false);
  };

  const getActivityInfo = (key) =>
    ACTIVITY_TYPES.find((t) => t.key === key) || ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Record crop activities from sowing to harvesting</Text>

        {/* Activity type summary chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {ACTIVITY_TYPES.map((type) => {
            const count = activities.filter((a) => a.activityType === type.key).length;
            return (
              <View key={type.key} style={[styles.chip, { borderColor: type.color }]}>
                <Text style={styles.chipIcon}>{type.icon}</Text>
                <Text style={[styles.chipLabel, { color: type.color }]}>{type.label}</Text>
                <Text style={[styles.chipCount, { color: type.color }]}>{count}</Text>
              </View>
            );
          })}
        </ScrollView>

        {activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>No Activities Recorded</Text>
            <Text style={styles.emptyText}>
              Start tracking your crop activities by tapping the + button below.
            </Text>
          </View>
        ) : (
          activities.map((activity) => {
            const info = getActivityInfo(activity.activityType);
            return (
              <View key={activity.id} style={[styles.activityCard, { borderLeftColor: info.color }]}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityIcon}>{info.icon}</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityCrop}>{activity.cropName}</Text>
                    <Text style={[styles.activityType, { color: info.color }]}>{info.label}</Text>
                  </View>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                    <TouchableOpacity
                      onPress={() => deleteActivity(activity.id)}
                      style={styles.deleteBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#d32f2f" />
                    </TouchableOpacity>
                  </View>
                </View>
                {activity.notes ? (
                  <Text style={styles.activityNotes}>{activity.notes}</Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add Activity Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Crop Activity</Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Crop Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Wheat, Tomato, Rice"
                value={cropName}
                onChangeText={setCropName}
              />

              <Text style={styles.label}>Activity Type *</Text>
              <View style={styles.typeGrid}>
                {ACTIVITY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeButton,
                      selectedType === type.key && {
                        backgroundColor: type.color,
                        borderColor: type.color,
                      },
                    ]}
                    onPress={() => setSelectedType(type.key)}
                  >
                    <Text style={styles.typeButtonIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.typeButtonLabel,
                        selectedType === type.key && { color: '#fff' },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={activityDate}
                onChangeText={setActivityDate}
                keyboardType="numbers-and-punctuation"
              />

              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional details, quantity, observations..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.saveButton} onPress={saveActivity}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Activity</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  chipRow: {
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  chipCount: {
    fontSize: 12,
    fontWeight: 'bold',
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
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  activityType: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  deleteBtn: {
    padding: 2,
  },
  activityNotes: {
    fontSize: 13,
    color: '#555',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    lineHeight: 18,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    marginBottom: 16,
    color: '#222',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  typeButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2d5016',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
