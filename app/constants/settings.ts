import { SettingCategory } from "../types";

export interface Settings {
  general: Record<string, any>
  dataControls: Record<string, any>
}

export const defaultSettings:Settings  = {
  general: {
    name: 'General',
    theme: 'System',
    showCode: false,
    language: 'Auto-detect',
  },
  dataControls: {
    name: 'Data controls',
  }
};
