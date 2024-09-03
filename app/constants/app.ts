import { ToastOptions } from "react-toastify";
import { Settings } from "@/app/types";

export const FPF_LABS_API_KEY = process.env.FPF_LABS_API_TEST_KEY!
export const API_BASE_URL = process.env.API_BASE_URL!;
export const CHART_ANALYSIS_URL = `${API_BASE_URL}/api/v1/analysis`;
export const CHART_ANALYSIS_RECURRING_URL = `${API_BASE_URL}/api/v1/analysis/recurring`;
export const CHART_ANALYSIS_RESULTS_URL =`${API_BASE_URL}/api/v1/analysis/results`;
export const SAVE_ANALYSIS_URL = `${API_BASE_URL}/api/v1/analysis/save`;
export const SHARED_ANALYSIS_URL = `${API_BASE_URL}/api/v1/share`;
export const JOURNAL_URL = `${API_BASE_URL}/api/v1/journal`;
export const REFRESH_TOKEN_URL = `${API_BASE_URL}/api/v1/auth/token`;
export const LOGIN_URL = `${API_BASE_URL}/api/v1/auth/login`;
export const LOGOUT_URL = `${API_BASE_URL}/api/v1/auth/logout`;
export const REGISTER_URL = `${API_BASE_URL}/api/v1/auth/register`;
export const USAGE_URL = `${API_BASE_URL}/api/v1/usage`;
export const BASE_URL = process.env.BASE_URL!;


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
  jobId: 'jobId',
  token: 'token',
  recentAnalyses: 'recent-analyses',
  recentCharts: 'recent-charts',
  subscription: 'stripe-subscription',
  settings: 'settings',
  usage: 'usage',
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

