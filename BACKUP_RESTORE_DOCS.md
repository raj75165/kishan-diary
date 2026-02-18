# Backup and Restore Documentation

## Overview

The Kishan Diary backup and restore module provides comprehensive functionality to backup and restore user data for the mobile app. This includes farm work records, implement information, and user settings.

## Features

- **Data Backup**: Create complete backups of all user data
- **Data Restoration**: Restore data from backup files
- **Data Integrity**: Checksum validation to ensure data integrity
- **Version Management**: Track backup format versions for compatibility
- **JSON Export/Import**: Standard JSON format for easy portability
- **Error Handling**: Comprehensive validation and error handling

## Installation

The module is a standalone JavaScript file that can be integrated into your mobile app:

```javascript
const backupRestore = require('./backup-restore');
```

## Usage

### Creating a Backup

```javascript
const data = {
  farmRecords: [
    {
      id: 1,
      date: '2026-02-10',
      activity: 'Plowing',
      area: '5 acres',
      notes: 'Prepared field for wheat sowing'
    }
  ],
  implements: [
    {
      id: 1,
      name: 'Tractor',
      model: 'John Deere 5050D',
      purchaseDate: '2025-01-15',
      status: 'operational'
    }
  ],
  settings: {
    language: 'en',
    units: 'metric',
    notifications: true
  }
};

// Create backup
const backup = backupRestore.createBackup(data);
console.log('Backup created:', backup);
```

### Exporting Backup to JSON

```javascript
// Export backup to JSON string
const jsonString = backupRestore.exportBackupToJSON(backup);

// Save to file or share
// For React Native, you might use react-native-fs or similar
// await RNFS.writeFile(backupPath, jsonString, 'utf8');
```

### Complete Backup Workflow

```javascript
// One-step backup creation and JSON export
const jsonBackup = backupRestore.performBackup(data);

// Save to file system
// await saveToFile(jsonBackup);
```

### Restoring from Backup

```javascript
// Import backup from JSON string
const backup = backupRestore.importBackupFromJSON(jsonString);

// Restore data with checksum validation (recommended)
const restoredData = backupRestore.restoreFromBackup(backup, true);

// Use restored data
console.log('Restored farm records:', restoredData.farmRecords);
console.log('Restored implements:', restoredData.implements);
console.log('Restored settings:', restoredData.settings);
```

### Complete Restore Workflow

```javascript
// One-step import and restore from JSON
const restoredData = backupRestore.performRestore(jsonString);

// Apply restored data to your app
// await updateAppData(restoredData);
```

## API Reference

### `createBackup(data)`

Creates a backup object from the provided data.

**Parameters:**
- `data` (Object): Data object containing:
  - `farmRecords` (Array, optional): Array of farm work records
  - `implements` (Array, optional): Array of farm implements
  - `settings` (Object, optional): User settings

**Returns:**
- (Object): Backup object with version, timestamp, checksum, and data

**Throws:**
- Error if data validation fails

### `restoreFromBackup(backup, validateChecksum)`

Restores data from a backup object.

**Parameters:**
- `backup` (Object): Backup object to restore from
- `validateChecksum` (Boolean, optional): Whether to validate checksum (default: true)

**Returns:**
- (Object): Restored data object

**Throws:**
- Error if backup is invalid or checksum validation fails

### `exportBackupToJSON(backup)`

Exports a backup object to JSON string.

**Parameters:**
- `backup` (Object): Backup object to export

**Returns:**
- (String): JSON string representation

**Throws:**
- Error if export fails

### `importBackupFromJSON(jsonString)`

Imports a backup from JSON string.

**Parameters:**
- `jsonString` (String): JSON string to import

**Returns:**
- (Object): Parsed backup object

**Throws:**
- Error if import or parsing fails

### `performBackup(data)`

Complete workflow: creates backup and exports to JSON.

**Parameters:**
- `data` (Object): Data to backup

**Returns:**
- (String): JSON string of the backup

### `performRestore(jsonString, validateChecksum)`

Complete workflow: imports from JSON and restores data.

**Parameters:**
- `jsonString` (String): JSON backup string
- `validateChecksum` (Boolean, optional): Whether to validate checksum (default: true)

**Returns:**
- (Object): Restored data

## Data Structure

### Input Data Format

```javascript
{
  farmRecords: [
    {
      id: Number,
      date: String,
      activity: String,
      area: String,
      notes: String
      // ... other fields
    }
  ],
  implements: [
    {
      id: Number,
      name: String,
      model: String,
      purchaseDate: String,
      status: String
      // ... other fields
    }
  ],
  settings: {
    language: String,
    units: String,
    notifications: Boolean
    // ... other settings
  }
}
```

### Backup Format

```javascript
{
  version: "1.0.0",
  timestamp: "2026-02-18T07:23:00.000Z",
  dataChecksum: "abc123",
  data: {
    farmRecords: [...],
    implements: [...],
    settings: {...}
  }
}
```

## Error Handling

The module provides comprehensive error handling for common scenarios:

- **Invalid input data**: Throws descriptive errors for invalid data types
- **Missing required fields**: Validates backup structure
- **Checksum mismatch**: Detects data corruption
- **Version incompatibility**: Checks backup version compatibility
- **JSON parsing errors**: Handles malformed JSON gracefully

Example error handling:

```javascript
try {
  const restoredData = backupRestore.performRestore(jsonString);
  // Use restored data
} catch (error) {
  console.error('Restore failed:', error.message);
  // Show error to user
}
```

## Security Considerations

1. **Data Validation**: All data is validated before processing
2. **Checksum Verification**: Optional checksum validation to detect tampering
3. **Version Control**: Backup version tracking prevents incompatible restores
4. **No Sensitive Data**: Ensure sensitive data (passwords, tokens) is not included in backups
5. **Secure Storage**: Store backup files securely with appropriate permissions

## Best Practices

1. **Regular Backups**: Implement automatic periodic backups
2. **User Confirmation**: Ask for user confirmation before restoring
3. **Backup Validation**: Always validate backups before restoring
4. **Version Info**: Display backup version and timestamp to users
5. **Error Messaging**: Provide clear error messages to users
6. **Testing**: Test backup and restore functionality thoroughly

## Testing

Run the test suite to verify functionality:

```bash
node test-backup-restore.js
```

The test suite includes:
- Valid data backup creation
- Invalid data handling
- Data restoration
- Checksum validation
- JSON export/import
- Complete workflows
- Empty data handling
- Version compatibility

## Integration Examples

### React Native Example

```javascript
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';
import backupRestore from './backup-restore';

// Create and save backup
async function createAndSaveBackup(appData) {
  try {
    const jsonBackup = backupRestore.performBackup(appData);
    const backupPath = `${RNFS.DocumentDirectoryPath}/kishan-diary-backup.json`;
    await RNFS.writeFile(backupPath, jsonBackup, 'utf8');
    
    // Share backup file
    await Share.open({
      url: `file://${backupPath}`,
      title: 'Share Backup'
    });
    
    return { success: true, path: backupPath };
  } catch (error) {
    console.error('Backup failed:', error);
    return { success: false, error: error.message };
  }
}

// Restore from backup file
async function restoreFromBackupFile() {
  try {
    // Pick backup file
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.json],
    });
    
    // Read file
    const jsonString = await RNFS.readFile(result[0].uri, 'utf8');
    
    // Restore data
    const restoredData = backupRestore.performRestore(jsonString);
    
    return { success: true, data: restoredData };
  } catch (error) {
    console.error('Restore failed:', error);
    return { success: false, error: error.message };
  }
}
```

### Node.js Example

```javascript
const fs = require('fs');
const backupRestore = require('./backup-restore');

// Create backup file
function saveBackup(data, filename) {
  const jsonBackup = backupRestore.performBackup(data);
  fs.writeFileSync(filename, jsonBackup, 'utf8');
  console.log(`Backup saved to ${filename}`);
}

// Restore from backup file
function loadBackup(filename) {
  const jsonString = fs.readFileSync(filename, 'utf8');
  const restoredData = backupRestore.performRestore(jsonString);
  return restoredData;
}
```

## Troubleshooting

### Common Issues

**Issue**: "Incompatible backup version" error
- **Solution**: The backup was created with a different version. Consider implementing version migration or creating a new backup.

**Issue**: "Data integrity check failed" error
- **Solution**: The backup file may be corrupted. Try restoring without checksum validation or use a different backup file.

**Issue**: JSON parsing errors
- **Solution**: Ensure the backup file is valid JSON and hasn't been manually edited.

## Changelog

### Version 1.0.0
- Initial release
- Basic backup and restore functionality
- Checksum validation
- JSON export/import
- Comprehensive error handling
- Test suite

## Future Enhancements

- Encryption support for sensitive data
- Incremental backups
- Cloud storage integration
- Automatic backup scheduling
- Backup compression
- Multiple backup versions management
- Data migration between versions
