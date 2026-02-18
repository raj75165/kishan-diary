# kishan-diary
Mobile app for tracking farm work and implements.

## Features

- **Farm Work Tracking**: Record and track daily farm activities
- **Implement Management**: Manage farm implements and equipment
- **Data Backup & Restore**: Secure backup and restore functionality for all your data

## Backup and Restore

This repository includes a comprehensive backup and restore module that allows users to:

- Create complete backups of farm records, implements, and settings
- Export backups as JSON files for sharing or storage
- Restore data from backup files with integrity validation
- Verify data integrity using checksums
- Handle version compatibility

### Quick Start

```javascript
const backupRestore = require('./backup-restore');

// Create a backup
const jsonBackup = backupRestore.performBackup(yourData);

// Restore from backup
const restoredData = backupRestore.performRestore(jsonBackup);
```

### Documentation

- [Backup & Restore Documentation](BACKUP_RESTORE_DOCS.md) - Comprehensive guide
- [Example Usage](example-usage.js) - Practical examples

### Testing

Run the test suite:

```bash
npm test
```

All 35 tests pass, covering:
- Data backup creation
- Data restoration
- Checksum validation
- Error handling
- JSON export/import
- Version compatibility

## Getting Started

1. Install dependencies (if any)
2. Review the documentation in `BACKUP_RESTORE_DOCS.md`
3. Run examples with `node example-usage.js`
4. Run tests with `npm test`

## License

ISC
