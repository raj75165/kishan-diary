import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppDataContext = createContext();

const STORAGE_KEYS = {
  FARMERS: 'app_farmers',
  WORK_LOGS: 'app_work_logs',
  EXPENSES: 'app_expenses',
  IMPLEMENTS: 'app_implements',
};

export const DEFAULT_IMPLEMENTS = [
  { id: 'harrow', name: 'Harrow', icon: '🔧', defaultRatePerAcre: 300 },
  { id: 'cultivator', name: 'Cultivator', icon: '🌱', defaultRatePerAcre: 350 },
  { id: 'rotavator', name: 'Rotavator', icon: '⚙️', defaultRatePerAcre: 500 },
  { id: 'plough', name: 'Plough', icon: '🌾', defaultRatePerAcre: 400 },
  { id: 'mb_plough', name: 'MB Plough', icon: '🚜', defaultRatePerAcre: 450 },
  { id: 'seeding', name: 'Seeding', icon: '🌿', defaultRatePerAcre: 600 },
  { id: 'fertilizer', name: 'Fertilizer Spreader', icon: '💧', defaultRatePerAcre: 250 },
  { id: 'maize', name: 'Maize Planter', icon: '🌽', defaultRatePerAcre: 700 },
  { id: 'thresher', name: 'Thresher', icon: '🏗️', defaultRatePerAcre: 800 },
  { id: 'laser_leveler', name: 'Laser Leveler', icon: '📐', defaultRatePerAcre: 1200 },
];

export const EXPENSE_TYPES = [
  { id: 'diesel', name: 'Diesel', icon: '⛽' },
  { id: 'tractor_service', name: 'Tractor Service', icon: '🔩' },
  { id: 'driver_salary', name: 'Driver Salary', icon: '👷' },
  { id: 'implement_maintenance', name: 'Implement Maintenance', icon: '🛠️' },
  { id: 'spare_parts', name: 'Spare Parts', icon: '🔧' },
  { id: 'insurance', name: 'Insurance', icon: '📋' },
  { id: 'other', name: 'Other', icon: '💼' },
];

export const AppDataProvider = ({ children }) => {
  const [farmers, setFarmers] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [implements_, setImplements] = useState(DEFAULT_IMPLEMENTS);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [farmersData, logsData, expensesData, implementsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FARMERS),
        AsyncStorage.getItem(STORAGE_KEYS.WORK_LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.IMPLEMENTS),
      ]);

      if (farmersData) setFarmers(JSON.parse(farmersData));
      if (logsData) setWorkLogs(JSON.parse(logsData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (implementsData) setImplements(JSON.parse(implementsData));
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setDataLoaded(true);
    }
  };

  // ── Farmers ──────────────────────────────────────────────────────────────

  const addFarmer = async (farmerData) => {
    try {
      const newFarmer = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...farmerData,
        createdAt: new Date().toISOString(),
      };
      const updated = [...farmers, newFarmer];
      await AsyncStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(updated));
      setFarmers(updated);
      return { success: true, farmer: newFarmer };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateFarmer = async (id, updates) => {
    try {
      const updated = farmers.map((f) => (f.id === id ? { ...f, ...updates } : f));
      await AsyncStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(updated));
      setFarmers(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteFarmer = async (id) => {
    try {
      const updated = farmers.filter((f) => f.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(updated));
      setFarmers(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ── Work Logs ─────────────────────────────────────────────────────────────

  const addWorkLog = async (logData) => {
    try {
      const newLog = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...logData,
        createdAt: new Date().toISOString(),
      };
      const updated = [...workLogs, newLog];
      await AsyncStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(updated));
      setWorkLogs(updated);
      return { success: true, log: newLog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateWorkLog = async (id, updates) => {
    try {
      const updated = workLogs.map((l) => (l.id === id ? { ...l, ...updates } : l));
      await AsyncStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(updated));
      setWorkLogs(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteWorkLog = async (id) => {
    try {
      const updated = workLogs.filter((l) => l.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(updated));
      setWorkLogs(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ── Expenses ──────────────────────────────────────────────────────────────

  const addExpense = async (expenseData) => {
    try {
      const newExpense = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...expenseData,
        createdAt: new Date().toISOString(),
      };
      const updated = [...expenses, newExpense];
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      setExpenses(updated);
      return { success: true, expense: newExpense };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      const updated = expenses.filter((e) => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      setExpenses(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ── Implements ────────────────────────────────────────────────────────────

  const addImplement = async (implData) => {
    try {
      const newImpl = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...implData,
      };
      const updated = [...implements_, newImpl];
      await AsyncStorage.setItem(STORAGE_KEYS.IMPLEMENTS, JSON.stringify(updated));
      setImplements(updated);
      return { success: true, implement: newImpl };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateImplement = async (id, updates) => {
    try {
      const updated = implements_.map((i) => (i.id === id ? { ...i, ...updates } : i));
      await AsyncStorage.setItem(STORAGE_KEYS.IMPLEMENTS, JSON.stringify(updated));
      setImplements(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────

  const csvEscape = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const exportCSV = (sheet) => {
    if (sheet === 'farmers') {
      const header = 'Name,Phone,Village,Total Area (acres),Notes';
      const rows = farmers.map((f) =>
        [f.name, f.phone, f.village, f.totalArea, f.notes].map(csvEscape).join(',')
      );
      return [header, ...rows].join('\n');
    }

    if (sheet === 'workLogs') {
      const header =
        'Date,Farmer Name,Implement,Acres,Hours,Rate/Acre (Rs),Total Amount (Rs),Amount Paid (Rs),Balance Due (Rs),Notes';
      const rows = workLogs.map((l) =>
        [
          l.date,
          l.farmerName,
          l.implementName,
          l.acres || 0,
          l.hours || 0,
          l.ratePerAcre || 0,
          l.totalAmount || 0,
          l.amountPaid || 0,
          (l.totalAmount || 0) - (l.amountPaid || 0),
          l.notes,
        ]
          .map(csvEscape)
          .join(',')
      );
      return [header, ...rows].join('\n');
    }

    if (sheet === 'expenses') {
      const header = 'Date,Type,Amount (Rs),Description,Notes';
      const rows = expenses.map((e) =>
        [e.date, e.typeName, e.amount, e.description, e.notes].map(csvEscape).join(',')
      );
      return [header, ...rows].join('\n');
    }

    return '';
  };

  // ── Backup / Restore ──────────────────────────────────────────────────────

  const exportBackup = () => {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      farmers,
      workLogs,
      expenses,
      implements: implements_,
    });
  };

  const importBackup = async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.version || !data.farmers || !data.workLogs || !data.expenses) {
        return { success: false, error: 'Invalid backup file format.' };
      }
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(data.farmers)),
        AsyncStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(data.workLogs)),
        AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses)),
        AsyncStorage.setItem(
          STORAGE_KEYS.IMPLEMENTS,
          JSON.stringify(data.implements || DEFAULT_IMPLEMENTS)
        ),
      ]);
      setFarmers(data.farmers);
      setWorkLogs(data.workLogs);
      setExpenses(data.expenses);
      setImplements(data.implements || DEFAULT_IMPLEMENTS);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ── Derived helpers ───────────────────────────────────────────────────────

  const getWorkLogsByFarmer = useCallback(
    (farmerId) => workLogs.filter((l) => l.farmerId === farmerId),
    [workLogs]
  );

  const getWorkLogsByImplement = useCallback(
    (implementId) => workLogs.filter((l) => l.implementId === implementId),
    [workLogs]
  );

  const getFarmerBalance = useCallback(
    (farmerId) => {
      const logs = workLogs.filter((l) => l.farmerId === farmerId);
      const total = logs.reduce((s, l) => s + (l.totalAmount || 0), 0);
      const paid = logs.reduce((s, l) => s + (l.amountPaid || 0), 0);
      return { total, paid, due: total - paid };
    },
    [workLogs]
  );

  return (
    <AppDataContext.Provider
      value={{
        farmers,
        workLogs,
        expenses,
        implements: implements_,
        dataLoaded,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        addExpense,
        deleteExpense,
        addImplement,
        updateImplement,
        exportBackup,
        importBackup,
        exportCSV,
        getWorkLogsByFarmer,
        getWorkLogsByImplement,
        getFarmerBalance,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
