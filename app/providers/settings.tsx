import React, { createContext, useState, useContext, useEffect, useLayoutEffect } from 'react';
import { ProviderProps, Settings } from '@/app/types';
import { StorageKeys, Time } from '../constants/app';
import {LocalStorage} from "@/app/lib/storage";
import { defaultSettings } from '../constants/app';
 
interface SettingsContextProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    showSettings: boolean;
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
    selectedSettingCategory: string
    setSelectedSettingCategory: React.Dispatch<React.SetStateAction< string>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

const SettingsProvider = ({ children }: ProviderProps) => {
    const [ settings, setSettings ] = useState<Settings>(defaultSettings);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedSettingCategory, setSelectedSettingCategory] = useState<string>(Object.values(defaultSettings)[0].name);

        // Retreive settings
        useLayoutEffect(() => {
            const userSettings = LocalStorage.get<Settings>(StorageKeys.settings);
            if (userSettings && typeof userSettings ==='object' ) {
                setSettings(userSettings); 
            }
        }, []);
    
        // Save settings
        useEffect(() => {
            const previousSettings = LocalStorage.get(StorageKeys.settings);
            if(previousSettings !== settings){
              LocalStorage.set(StorageKeys.settings, JSON.stringify(settings))
            }
        }, [settings]);
    
   
  return (
    <SettingsContext.Provider value={{
      settings,
      setSettings,
      showSettings,
      setShowSettings,
      selectedSettingCategory, 
      setSelectedSettingCategory
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  const { settings, showSettings, selectedSettingCategory, setShowSettings, setSettings, setSelectedSettingCategory } = context;

  const toggleSettings = () => {
    setShowSettings(prev => !prev)
}

const updateSettings = (category: keyof Settings, updatedSetting: Record<string, any>) => {
  setSettings(prevSettings => {
    const newSettings = { ...prevSettings };
    Object.entries(updatedSetting).forEach(([key, value]) => {
      newSettings[category] = {
        ...newSettings[category],
        [key]: value
      };
    });
    return newSettings;
  });
};

const switchSettings = (settingType: keyof Settings) => {
  setSelectedSettingCategory(settingType);
}


    return {
        settings,
        showSettings,
        selectedSettingCategory,
        toggleSettings,
        updateSettings,
        switchSettings
     };
};



export { SettingsContext, SettingsProvider, useSettings };
