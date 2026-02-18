/**
 * Example usage of backup and restore functionality
 * This demonstrates practical usage scenarios for the Kishan Diary app
 */

const backupRestore = require('./backup-restore');

// Sample application data
const appData = {
  farmRecords: [
    {
      id: 1,
      date: '2026-02-10',
      activity: 'Plowing',
      crop: 'Wheat',
      area: '5 acres',
      notes: 'Prepared field for wheat sowing',
      weather: 'Sunny',
      cost: 5000
    },
    {
      id: 2,
      date: '2026-02-12',
      activity: 'Sowing',
      crop: 'Wheat',
      area: '5 acres',
      notes: 'Sowed wheat seeds',
      weather: 'Partly cloudy',
      cost: 8000
    },
    {
      id: 3,
      date: '2026-02-15',
      activity: 'Irrigation',
      crop: 'Wheat',
      area: '10 acres',
      notes: 'First irrigation after sowing',
      weather: 'Clear',
      cost: 2000
    }
  ],
  implements: [
    {
      id: 1,
      name: 'Tractor',
      model: 'John Deere 5050D',
      manufacturer: 'John Deere',
      purchaseDate: '2025-01-15',
      purchasePrice: 1200000,
      status: 'operational',
      maintenanceDue: '2026-03-15',
      notes: 'Regular service completed'
    },
    {
      id: 2,
      name: 'Plow',
      model: 'MB Plough',
      manufacturer: 'Mahindra',
      purchaseDate: '2025-01-20',
      purchasePrice: 45000,
      status: 'operational',
      maintenanceDue: '2026-04-20',
      notes: 'Working well'
    },
    {
      id: 3,
      name: 'Seed Drill',
      model: 'SD-100',
      manufacturer: 'AgriTools',
      purchaseDate: '2025-02-10',
      purchasePrice: 85000,
      status: 'operational',
      maintenanceDue: '2026-05-10',
      notes: 'Recently serviced'
    }
  ],
  settings: {
    language: 'en',
    units: 'metric',
    currency: 'INR',
    notifications: true,
    autoBackup: false,
    theme: 'light',
    dateFormat: 'DD/MM/YYYY'
  }
};

console.log('=== Kishan Diary Backup & Restore Example ===\n');

// Example 1: Create a backup
console.log('Example 1: Creating a backup...');
try {
  const jsonBackup = backupRestore.performBackup(appData);
  console.log('✓ Backup created successfully');
  console.log('Backup size:', jsonBackup.length, 'bytes');
  console.log('\nBackup preview (first 200 chars):');
  console.log(jsonBackup.substring(0, 200) + '...\n');
} catch (error) {
  console.error('✗ Backup failed:', error.message);
}

// Example 2: Export backup for sharing
console.log('Example 2: Exporting backup...');
try {
  const backup = backupRestore.createBackup(appData);
  const jsonString = backupRestore.exportBackupToJSON(backup);
  
  console.log('✓ Backup exported to JSON');
  console.log('Backup metadata:');
  console.log('  Version:', backup.version);
  console.log('  Timestamp:', backup.timestamp);
  console.log('  Checksum:', backup.dataChecksum);
  console.log('  Farm Records:', backup.data.farmRecords.length);
  console.log('  Implements:', backup.data.implements.length);
  console.log('  Settings:', Object.keys(backup.data.settings).length, 'keys\n');
} catch (error) {
  console.error('✗ Export failed:', error.message);
}

// Example 3: Restore from backup
console.log('Example 3: Restoring from backup...');
try {
  // Create backup
  const jsonBackup = backupRestore.performBackup(appData);
  
  // Restore from backup
  const restoredData = backupRestore.performRestore(jsonBackup);
  
  console.log('✓ Data restored successfully');
  console.log('Restored data summary:');
  console.log('  Farm Records:', restoredData.farmRecords.length);
  console.log('  Implements:', restoredData.implements.length);
  console.log('  Language:', restoredData.settings.language);
  console.log('  Currency:', restoredData.settings.currency);
  console.log('\nFirst farm record:');
  console.log('  Date:', restoredData.farmRecords[0].date);
  console.log('  Activity:', restoredData.farmRecords[0].activity);
  console.log('  Crop:', restoredData.farmRecords[0].crop);
  console.log('  Area:', restoredData.farmRecords[0].area);
  console.log('  Cost:', restoredData.farmRecords[0].cost, restoredData.settings.currency);
  console.log('\n');
} catch (error) {
  console.error('✗ Restore failed:', error.message);
}

// Example 4: Handling backup with checksum validation
console.log('Example 4: Data integrity with checksum validation...');
try {
  const backup = backupRestore.createBackup(appData);
  
  // Restore with checksum validation (recommended)
  const restoredWithValidation = backupRestore.restoreFromBackup(backup, true);
  console.log('✓ Restore with checksum validation: SUCCESS');
  
  // Simulate data corruption
  const corruptedBackup = JSON.parse(JSON.stringify(backup));
  corruptedBackup.data.farmRecords[0].activity = 'Corrupted Activity';
  
  try {
    backupRestore.restoreFromBackup(corruptedBackup, true);
    console.log('✗ Should have detected corruption!');
  } catch (error) {
    console.log('✓ Corruption detected:', error.message);
  }
  
  // Restore without validation (not recommended)
  const restoredWithoutValidation = backupRestore.restoreFromBackup(corruptedBackup, false);
  console.log('✓ Restore without validation: SUCCESS (but data may be corrupted)\n');
} catch (error) {
  console.error('✗ Checksum test failed:', error.message);
}

// Example 5: Backup with partial data
console.log('Example 5: Backing up partial data...');
try {
  const partialData = {
    farmRecords: appData.farmRecords,
    implements: [],
    settings: {}
  };
  
  const backup = backupRestore.createBackup(partialData);
  const restored = backupRestore.restoreFromBackup(backup);
  
  console.log('✓ Partial data backup successful');
  console.log('  Farm Records:', restored.farmRecords.length);
  console.log('  Implements:', restored.implements.length, '(empty)');
  console.log('  Settings:', Object.keys(restored.settings).length, 'keys (empty)\n');
} catch (error) {
  console.error('✗ Partial backup failed:', error.message);
}

// Example 6: Error handling demonstration
console.log('Example 6: Error handling...');

// Invalid data
try {
  backupRestore.createBackup(null);
} catch (error) {
  console.log('✓ Caught error for null data:', error.message);
}

// Invalid backup
try {
  backupRestore.restoreFromBackup({ invalid: 'backup' });
} catch (error) {
  console.log('✓ Caught error for invalid backup:', error.message);
}

// Invalid JSON
try {
  backupRestore.importBackupFromJSON('not valid json');
} catch (error) {
  console.log('✓ Caught error for invalid JSON:', error.message);
}

// Incompatible version
try {
  const backup = backupRestore.createBackup(appData);
  backup.version = '2.0.0';
  backupRestore.restoreFromBackup(backup);
} catch (error) {
  console.log('✓ Caught error for incompatible version:', error.message);
}

console.log('\n=== Example Usage Complete ===');
console.log('\nFor more details, see BACKUP_RESTORE_DOCS.md');
