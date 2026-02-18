/**
 * Backup and Restore Utility for Kishan Diary
 * A mobile app for tracking farm work and implements
 * 
 * This module provides functions to backup and restore user data
 * including farm work records, implement information, and other app data.
 */

const BACKUP_VERSION = "1.0.0";

/**
 * Creates a backup of all user data
 * @param {Object} data - The data object to backup
 * @param {Array} data.farmRecords - Array of farm work records
 * @param {Array} data.implements - Array of farm implements/tools
 * @param {Object} data.settings - User settings and preferences
 * @returns {Object} Backup object with metadata and data
 * @throws {Error} If data validation fails
 */
function createBackup(data) {
  // Validate input data
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: data must be a non-null object');
  }

  // Validate data structure
  if (data.farmRecords && !Array.isArray(data.farmRecords)) {
    throw new Error('Invalid data: farmRecords must be an array');
  }
  
  if (data.implements && !Array.isArray(data.implements)) {
    throw new Error('Invalid data: implements must be an array');
  }

  if (data.settings && typeof data.settings !== 'object') {
    throw new Error('Invalid data: settings must be an object');
  }

  // Create backup object with metadata
  const backup = {
    version: BACKUP_VERSION,
    timestamp: new Date().toISOString(),
    dataChecksum: calculateChecksum(data),
    data: {
      farmRecords: data.farmRecords || [],
      implements: data.implements || [],
      settings: data.settings || {}
    }
  };

  return backup;
}

/**
 * Restores data from a backup
 * @param {Object} backup - The backup object to restore from
 * @param {boolean} validateChecksum - Whether to validate data checksum (default: true)
 * @returns {Object} The restored data object
 * @throws {Error} If backup is invalid or restoration fails
 */
function restoreFromBackup(backup, validateChecksum = true) {
  // Validate backup structure
  if (!backup || typeof backup !== 'object') {
    throw new Error('Invalid backup: backup must be a non-null object');
  }

  if (!backup.version) {
    throw new Error('Invalid backup: missing version information');
  }

  if (!backup.data) {
    throw new Error('Invalid backup: missing data');
  }

  // Check version compatibility
  if (!isVersionCompatible(backup.version)) {
    throw new Error(`Incompatible backup version: ${backup.version}. Current version: ${BACKUP_VERSION}`);
  }

  // Validate checksum if requested
  if (validateChecksum && backup.dataChecksum) {
    const currentChecksum = calculateChecksum(backup.data);
    if (currentChecksum !== backup.dataChecksum) {
      throw new Error('Data integrity check failed: checksum mismatch');
    }
  }

  // Validate restored data structure
  const data = backup.data;
  
  if (data.farmRecords && !Array.isArray(data.farmRecords)) {
    throw new Error('Invalid backup data: farmRecords must be an array');
  }
  
  if (data.implements && !Array.isArray(data.implements)) {
    throw new Error('Invalid backup data: implements must be an array');
  }

  if (data.settings && typeof data.settings !== 'object') {
    throw new Error('Invalid backup data: settings must be an object');
  }

  // Return the restored data
  return {
    farmRecords: data.farmRecords || [],
    implements: data.implements || [],
    settings: data.settings || {}
  };
}

/**
 * Exports backup to JSON string
 * @param {Object} backup - The backup object to export
 * @returns {string} JSON string representation of the backup
 * @throws {Error} If export fails
 */
function exportBackupToJSON(backup) {
  try {
    return JSON.stringify(backup, null, 2);
  } catch (error) {
    throw new Error(`Failed to export backup to JSON: ${error.message}`);
  }
}

/**
 * Imports backup from JSON string
 * @param {string} jsonString - The JSON string to import
 * @returns {Object} The parsed backup object
 * @throws {Error} If import fails
 */
function importBackupFromJSON(jsonString) {
  if (typeof jsonString !== 'string') {
    throw new Error('Invalid input: jsonString must be a string');
  }

  try {
    const backup = JSON.parse(jsonString);
    return backup;
  } catch (error) {
    throw new Error(`Failed to import backup from JSON: ${error.message}`);
  }
}

/**
 * Calculates a simple checksum for data integrity verification
 * @param {Object} data - The data object to checksum
 * @returns {string} Checksum string
 */
function calculateChecksum(data) {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Checks if a backup version is compatible with the current version
 * @param {string} backupVersion - The version string from the backup
 * @returns {boolean} True if compatible, false otherwise
 */
function isVersionCompatible(backupVersion) {
  // For now, only support exact version match
  // In future, implement semantic versioning compatibility
  const [backupMajor] = backupVersion.split('.');
  const [currentMajor] = BACKUP_VERSION.split('.');
  
  return backupMajor === currentMajor;
}

/**
 * Creates a complete backup workflow: create backup and export to JSON
 * @param {Object} data - The data to backup
 * @returns {string} JSON string of the backup
 */
function performBackup(data) {
  const backup = createBackup(data);
  return exportBackupToJSON(backup);
}

/**
 * Performs a complete restore workflow: import from JSON and restore data
 * @param {string} jsonString - The JSON backup string
 * @param {boolean} validateChecksum - Whether to validate checksum
 * @returns {Object} The restored data
 */
function performRestore(jsonString, validateChecksum = true) {
  const backup = importBackupFromJSON(jsonString);
  return restoreFromBackup(backup, validateChecksum);
}

// Export functions
module.exports = {
  createBackup,
  restoreFromBackup,
  exportBackupToJSON,
  importBackupFromJSON,
  performBackup,
  performRestore,
  BACKUP_VERSION
};
