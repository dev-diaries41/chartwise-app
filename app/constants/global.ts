import { ToastOptions } from "react-toastify";
import { Settings } from "@/app/types";

export const AcceptedMimes = [
    'text/csv',
    'application/json',
    'application/pdf',
    'text/markdown',
    'text/x-markdown'
  ]

export const AcceptedImgMimes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
  ]

export const AcceptedDocFiles = [
  '.json', 
  '.csv', 
  '.md'
]
export const AcceptedImgFiles = [
  '.png', 
  '.jpg', 
  '.jpeg'
]

export const Time = {
  sec: 1000,
  min: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
} as const;


export const StorageKeys = {
  cwauth: 'cwauth',
  jobId: 'jobId',
  recentAnalyses: 'recent-analyses',
  recentCharts: 'recent-charts',
  subscription: 'stripe-subscription',
  settings: 'settings',
  encrypt: 'encrypt'
}

export const DefaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}


export const DefaultSettings:Settings  = {
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

export const PlanAmount = {
  basic:999,
  pro:2599,
  elite: 3999,
}
