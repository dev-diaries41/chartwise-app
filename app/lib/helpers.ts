import { PlanAmount, StorageKeys, Time } from "../constants/global";
import { UserPlan, UserProfileInfo } from "../types";
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
      } else if (subscriptionAmount === PlanAmount.elite) {
        return 'Elite';
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