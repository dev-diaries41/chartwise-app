import { PlanAmount, StorageKeys, Time } from "../constants/global";
import { IAnalysis, IAnalysisUrl, UserPlan, UserProfileInfo } from "../types";
import {SessionStorage} from "./storage"


export function copyTextToClipboard(text: string | null) {
  if(!text)return
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
    }).catch((error) => {
      console.error('Error copying text to clipboard:', error);
    });
  }


  export const shouldHide = (pathname: string, pathsToHide: string[]) => pathsToHide.some(pathToHide => pathname.includes(pathToHide))

  export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

export function convertToNumber(value: string | number, defaultValue: number): number {
  if (typeof value === 'number') {
    return value;
  }

  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return defaultValue;
  }

  return parsedValue;
}


  export function cacheUserPlan (userPlan: UserPlan) {
    const ttl = Time.min;
    const expiresAt = Date.now() + ttl;
    SessionStorage.set(StorageKeys.subscription, JSON.stringify({ userPlan, expiresAt } as UserProfileInfo));
  }


  export function getPlanFromPlanAmount(subscriptionAmount: number){
    if (subscriptionAmount === PlanAmount.basic) {
      return 'Basic';
    } else if (subscriptionAmount === PlanAmount.pro) {
      return 'Pro';
    } 
  }

export function getCurrentMonth() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthIndex = new Date(Date.now()).getUTCMonth();
  return monthNames[currentMonthIndex];
}

export function getAnalysisName(filename: string) {
  const regex = /^[A-Z0-9]+_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/;
  const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
  if (regex.test(nameWithoutExtension)) {
    return nameWithoutExtension;
  } else {
    return `Analysis_${Date.now()}`;
  }
}

export function formatAnalyses(analyses: (IAnalysis & {_id: string})[]): IAnalysisUrl[]{
  return analyses.map(analysis => ({name: analysis.name, analyseUrl: `${window.location.origin}/share/${analysis._id}`})) || []
}