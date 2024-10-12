'use client'
import { useSettings } from '@/app/providers/settings';
import { SettingCategory, type Settings } from '@/app/types';
import React, { useState } from 'react';
import Switch from './switch';




export default function Settings (){
  const {settings, selectedSettingCategory, switchSettings, toggleSettings, updateSettings} = useSettings();


  const chartwiseSettings: SettingCategory[] = React.useMemo(() => [
    {
      name: settings.general.name,
      items: [
        {
          type: 'dropdown',
          label: 'Theme',
          options: ['System', 'Light', 'Dark'],
          value: settings.general.theme,
          onChange: (theme) =>{
            updateSettings('general', {theme})
          },      
        },
        {
          type: 'toggle',
          label: 'Always show code when using data analyst',
          value: settings.general.showCode,
          onChange: (showCode) =>{
            updateSettings('general', {showCode})
          },
        },
        {
          type: 'dropdown',
          label: 'Language',
          options: ['Auto-detect', 'English', 'Spanish'],
          value: settings.general.language,
          onChange: (language) =>{
            updateSettings('general', {language})
          },      
        },
      ],
    },
    {
      name: settings.dataControls.name,
      items: [
        {
          type: 'button',
          label: 'Archive all chats',
          onChange: () => console.log('Archive all chats'),
        },
        {
          type: 'button',
          label: 'Delete all chats',
          onChange: () => console.log('Delete all chats'),
        },
      ],
    },
  ], [settings]);


  return (
    <section id={'settings'} className="fixed inset-0 flex items-center justify-center z-[1000] max-w-[100%] lg:max-w-[60%] mx-auto">
      <div className="fixed inset-0 bg-black opacity-80"></div>
      <div className="flex-grow flex-col min-h-[500px] overflow-y-auto w-full max-w-[80%] bg-gray-800 text-white rounded-lg shadow-lg font-sans text-left text-sm flex z-10">
        <div className="flex flex-row justify-between items-center p-4">
            <h2 className="text-xl">Settings</h2>
            <button className="text-2xl" onClick={toggleSettings}>&times;</button>
        </div>
        <div className='border-b border-gray-700'></div>

        <div className='flex flex-col md:flex-row w-full'>
          <div className="flex flex-row md:flex-col w-full max-w-[1000%] md:max-w-[20%] justify-start p-4 gap-2">
              {chartwiseSettings.map((settingCategory, index) => (
              <div key={index} className={`${selectedSettingCategory === settingCategory.name? 'bg-gray-700' : ''} rounded-md p-2 mb-2 `}>
                  <h3
                  className={`text-md font-semibold ${(selectedSettingCategory) === settingCategory.name? 'text-white' : 'text-gray-500'}`}
                  onClick={() => switchSettings(settingCategory.name as keyof Settings)}
                  >
                  {settingCategory.name}
                  </h3>
              </div>
              ))}
          </div>

          <div className="flex flex-col w-full p-5">
              {(chartwiseSettings.filter(setting => setting.name === selectedSettingCategory)[0]).items.map((item, idx) => (
              <div key={idx} className="w-full flex justify-between items-center mb-3">
                  <label className="flex-1">{item.label}</label>
                  {item.type === 'dropdown' && item.options && (
                  <select
                      className="ml-3 p-2 bg-transparent focus-outline:none w-auto"
                      value={item.value as string}
                      onChange={(e) => item.onChange && item.onChange(e.target.value)}
                  >
                      {item.options.map((option, optionIdx) => (
                      <option key={optionIdx} value={option} className='bg-gray-700'>
                          {option}
                      </option>
                      ))}
                  </select>
                  )}
                 {item.type === 'toggle' && (
                  <Switch value={item.value as boolean} onChange={item.onChange} />
                  )}
                  {item.type === 'button' && (
                  <button
                      className={`flex-1 ml-3 p-2 text-xs ${item.label.toLowerCase().includes('delete')? 'bg-red-600 hover:bg-red-500 ': 'bg-gray-700 hover:bg-gray-600 '} rounded-full hover:bg-red-600 max-w-[20%]`}
                      onClick={() => item.onChange && item.onChange(true)}
                  >
                      {item.label.replace('chats', '')}
                  </button>
                  )}
              </div>
              ))}
          </div>
        </div>  
      </div>
    </section>
  );
};
