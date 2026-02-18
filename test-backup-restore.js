/**
 * Test suite for backup and restore functionality
 * Run with: node test-backup-restore.js
 */

const backupRestore = require('./backup-restore');

// Test counter
let testsPassed = 0;
let testsFailed = 0;

/**
 * Simple test assertion function
 */
function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log('✓ PASS:', message);
  } else {
    testsFailed++;
    console.error('✗ FAIL:', message);
  }
}

/**
 * Test that function throws expected error
 */
function assertThrows(fn, expectedMessage, testMessage) {
  try {
    fn();
    testsFailed++;
    console.error('✗ FAIL:', testMessage, '- Expected error but none was thrown');
  } catch (error) {
    if (expectedMessage && !error.message.includes(expectedMessage)) {
      testsFailed++;
      console.error('✗ FAIL:', testMessage, `- Expected error message to include "${expectedMessage}", got "${error.message}"`);
    } else {
      testsPassed++;
      console.log('✓ PASS:', testMessage);
    }
  }
}

// Sample test data
const sampleData = {
  farmRecords: [
    {
      id: 1,
      date: '2026-02-10',
      activity: 'Plowing',
      area: '5 acres',
      notes: 'Prepared field for wheat sowing'
    },
    {
      id: 2,
      date: '2026-02-15',
      activity: 'Irrigation',
      area: '10 acres',
      notes: 'Watered the wheat field'
    }
  ],
  implements: [
    {
      id: 1,
      name: 'Tractor',
      model: 'John Deere 5050D',
      purchaseDate: '2025-01-15',
      status: 'operational'
    },
    {
      id: 2,
      name: 'Plow',
      model: 'MB Plough',
      purchaseDate: '2025-01-20',
      status: 'operational'
    }
  ],
  settings: {
    language: 'en',
    units: 'metric',
    notifications: true
  }
};

console.log('\n=== Testing Backup and Restore Functionality ===\n');

// Test 1: Create backup with valid data
console.log('Test 1: Create backup with valid data');
try {
  const backup = backupRestore.createBackup(sampleData);
  assert(backup.version === backupRestore.BACKUP_VERSION, 'Backup should have correct version');
  assert(backup.timestamp !== undefined, 'Backup should have timestamp');
  assert(backup.dataChecksum !== undefined, 'Backup should have checksum');
  assert(backup.data.farmRecords.length === 2, 'Backup should contain farm records');
  assert(backup.data.implements.length === 2, 'Backup should contain implements');
  assert(backup.data.settings.language === 'en', 'Backup should contain settings');
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Create backup - Error:', error.message);
}

// Test 2: Create backup with invalid data
console.log('\nTest 2: Create backup with invalid data');
assertThrows(
  () => backupRestore.createBackup(null),
  'Invalid data',
  'Should throw error for null data'
);
assertThrows(
  () => backupRestore.createBackup({ farmRecords: 'not an array' }),
  'farmRecords must be an array',
  'Should throw error for invalid farmRecords type'
);
assertThrows(
  () => backupRestore.createBackup({ implements: 'not an array' }),
  'implements must be an array',
  'Should throw error for invalid implements type'
);
assertThrows(
  () => backupRestore.createBackup({ settings: 'not an object' }),
  'settings must be an object',
  'Should throw error for invalid settings type'
);

// Test 3: Restore from backup
console.log('\nTest 3: Restore from valid backup');
try {
  const backup = backupRestore.createBackup(sampleData);
  const restored = backupRestore.restoreFromBackup(backup);
  assert(restored.farmRecords.length === 2, 'Restored data should have farm records');
  assert(restored.implements.length === 2, 'Restored data should have implements');
  assert(restored.settings.language === 'en', 'Restored data should have settings');
  assert(
    JSON.stringify(restored.farmRecords) === JSON.stringify(sampleData.farmRecords),
    'Restored farm records should match original'
  );
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Restore from backup - Error:', error.message);
}

// Test 4: Restore from invalid backup
console.log('\nTest 4: Restore from invalid backup');
assertThrows(
  () => backupRestore.restoreFromBackup(null),
  'Invalid backup',
  'Should throw error for null backup'
);
assertThrows(
  () => backupRestore.restoreFromBackup({}),
  'missing version',
  'Should throw error for backup without version'
);
assertThrows(
  () => backupRestore.restoreFromBackup({ version: '1.0.0' }),
  'missing data',
  'Should throw error for backup without data'
);

// Test 5: Data integrity check (checksum validation)
console.log('\nTest 5: Data integrity check');
try {
  const backup = backupRestore.createBackup(sampleData);
  const originalChecksum = backup.dataChecksum;
  
  // Restore should work with correct checksum
  const restored = backupRestore.restoreFromBackup(backup, true);
  assert(restored !== null, 'Should restore successfully with valid checksum');
  
  // Tamper with data and restore should fail
  backup.data.farmRecords[0].activity = 'Tampered Activity';
  assertThrows(
    () => backupRestore.restoreFromBackup(backup, true),
    'checksum mismatch',
    'Should throw error when checksum validation fails'
  );
  
  // Restore without checksum validation should work even with tampered data
  const restoredWithoutValidation = backupRestore.restoreFromBackup(backup, false);
  assert(restoredWithoutValidation !== null, 'Should restore without checksum validation');
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Data integrity check - Error:', error.message);
}

// Test 6: Export and import JSON
console.log('\nTest 6: Export and import JSON');
try {
  const backup = backupRestore.createBackup(sampleData);
  const jsonString = backupRestore.exportBackupToJSON(backup);
  
  assert(typeof jsonString === 'string', 'Export should return string');
  assert(jsonString.includes('"version"'), 'JSON should contain version');
  assert(jsonString.includes('"farmRecords"'), 'JSON should contain farmRecords');
  
  const importedBackup = backupRestore.importBackupFromJSON(jsonString);
  assert(importedBackup.version === backup.version, 'Imported backup should have same version');
  assert(
    JSON.stringify(importedBackup.data) === JSON.stringify(backup.data),
    'Imported data should match original'
  );
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Export and import JSON - Error:', error.message);
}

// Test 7: Import from invalid JSON
console.log('\nTest 7: Import from invalid JSON');
assertThrows(
  () => backupRestore.importBackupFromJSON('invalid json'),
  'Failed to import',
  'Should throw error for invalid JSON'
);
assertThrows(
  () => backupRestore.importBackupFromJSON(null),
  'jsonString must be a string',
  'Should throw error for null input'
);

// Test 8: Complete backup and restore workflow
console.log('\nTest 8: Complete backup and restore workflow');
try {
  const jsonBackup = backupRestore.performBackup(sampleData);
  assert(typeof jsonBackup === 'string', 'Perform backup should return JSON string');
  
  const restoredData = backupRestore.performRestore(jsonBackup);
  assert(
    JSON.stringify(restoredData.farmRecords) === JSON.stringify(sampleData.farmRecords),
    'Complete workflow should restore original data'
  );
  assert(
    JSON.stringify(restoredData.implements) === JSON.stringify(sampleData.implements),
    'Complete workflow should restore implements'
  );
  assert(
    JSON.stringify(restoredData.settings) === JSON.stringify(sampleData.settings),
    'Complete workflow should restore settings'
  );
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Complete workflow - Error:', error.message);
}

// Test 9: Handle empty data
console.log('\nTest 9: Handle empty data');
try {
  const emptyData = {
    farmRecords: [],
    implements: [],
    settings: {}
  };
  const backup = backupRestore.createBackup(emptyData);
  const restored = backupRestore.restoreFromBackup(backup);
  
  assert(restored.farmRecords.length === 0, 'Should handle empty farmRecords');
  assert(restored.implements.length === 0, 'Should handle empty implements');
  assert(Object.keys(restored.settings).length === 0, 'Should handle empty settings');
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Handle empty data - Error:', error.message);
}

// Test 10: Version compatibility
console.log('\nTest 10: Version compatibility');
try {
  const backup = backupRestore.createBackup(sampleData);
  
  // Test with incompatible version
  const incompatibleBackup = { ...backup, version: '2.0.0' };
  assertThrows(
    () => backupRestore.restoreFromBackup(incompatibleBackup),
    'Incompatible backup version',
    'Should throw error for incompatible version'
  );
} catch (error) {
  testsFailed++;
  console.error('✗ FAIL: Version compatibility - Error:', error.message);
}

// Print results
console.log('\n=== Test Results ===');
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed!');
  process.exit(1);
}
