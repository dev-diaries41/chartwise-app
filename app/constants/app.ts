import { ToastOptions } from "react-toastify";

// API URLs
export const CHART_ANALYSIS_URL = process.env.CHART_ANALYSIS_URL!;
export const CHART_ANALYSIS_RESULTS_URL = process.env.CHART_ANALYSIS_RESULTS_URL!;
export const SAVE_ANALYSIS_URL = process.env.SAVE_ANALYSIS_URL!;
export const SHARED_ANALYSIS_URL = process.env.SHARED_ANALYSIS_URL!;
export const CHART_ANALYSIS_RECURRING_URL = process.env.CHART_ANALYSIS_RECURRING_URL!;
export const USAGE_URL = process.env.USAGE_URL!;
export const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL!;
export const BASE_URL = process.env.BASE_URL!;
export const FPF_LABS_API_KEY = process.env.FPF_LABS_API_KEY!


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

export const AcceptedDocFiles = ['.json', '.csv', '.md']
export const AcceptedImgFiles = ['.png', '.jpg', '.jpeg']

const sec = 1000;
const min = 60 * sec;
const hour = 60 * min;
const day = 24 * hour;
const week = 7 * day;

export const Time = {
    sec,
    min,
    hour,
    day,
    week
}

export const StorageKeys = {
  jobId: 'jobId',
  token: 'token',
  recentAnalyses: 'recent-analyses',
  recentCharts: 'recent-charts',
  subscription: 'stripe-subscription',
  credits: 'credits',
  settings: 'settings',
  usage: 'usage'
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
