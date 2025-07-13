import type { Trade } from '../models/Trade';

const STORAGE_KEYS = {
  TRADES: 'trade-tracker-trades',
  SETTINGS: 'trade-tracker-settings',
} as const;

export interface AppSettings {
  theme: 'light' | 'dark';
  pageSize: number;
  defaultCurrency: string;
  notifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  pageSize: 10,
  defaultCurrency: 'USD',
  notifications: true,
};

export const storageUtils = {
  // Trades
  getTrades: (): Trade[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRADES);
      if (!stored) return [];
      
      const trades = JSON.parse(stored);
      return Array.isArray(trades) ? trades : [];
    } catch (error) {
      console.error('Error loading trades from storage:', error);
      return [];
    }
  },

  saveTrades: (trades: Trade[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch (error) {
      console.error('Error saving trades to storage:', error);
    }
  },

  // Settings
  getSettings: (): AppSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;
      
      const settings = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: Partial<AppSettings>): void => {
    try {
      const currentSettings = storageUtils.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  },

  // Backup and restore
  exportData: (): string => {
    try {
      const data = {
        trades: storageUtils.getTrades(),
        settings: storageUtils.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.trades && Array.isArray(data.trades)) {
        storageUtils.saveTrades(data.trades);
      }
      
      if (data.settings && typeof data.settings === 'object') {
        storageUtils.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRADES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
}; 