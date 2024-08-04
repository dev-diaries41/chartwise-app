import { Time } from "@/app/constants/app";
import * as AES from 'aes-js';

export class LocalStorage {
  public static set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  public static remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from storage:', error);
    }
  }

  public static get<T>(key: string): T | string | null {
    try {
      const jsonData = localStorage.getItem(key);
      try {
        return JSON.parse(jsonData!) as T;
      } catch {
        return jsonData;
      }
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return null;
    }
  }

  public static append(key: string, item: any) {
    try {
      const existingArray = this.get(key);
      if (Array.isArray(existingArray)) {
        existingArray.push(item);
        this.set(key, JSON.stringify(existingArray));
      } else {
        this.set(key, JSON.stringify([item]));
      }
    } catch (error) {
      console.error('Error appending to array:', error);
    }
  }

  public static removeItemFromArray(key: string, callback: (item: any) => boolean) {
    try {
      const existingArray = this.get(key);
      if (Array.isArray(existingArray)) {
        const filteredArray = existingArray.filter(callback);
        this.set(key, JSON.stringify(filteredArray));
      }
    } catch (error) {
      console.error('Error removing item from array:', error);
    }
  }

  public static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  public static getCachedData<T>(storageKey: string, onValid: (data: T) => void): boolean {
    const cachedData = this.get<{ data: T, expiresAt: number }>(storageKey);
    if (cachedData && typeof cachedData === 'object') {
      const { data, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        onValid(data);
        return true;
      }
    }
    return false;
  }

  public static cacheData(storageKey: string, data: object, ttl = Time.min): void {
    const expiresAt = Date.now() + ttl;
    this.set(storageKey, JSON.stringify({ data, expiresAt }));
  }
}


export class SessionStorage {
  public static set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  public static remove(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from storage:', error);
    }
  }

  public static get<T>(key: string): T | string | null {
    try {
      const jsonData = sessionStorage.getItem(key);
      try {
        return JSON.parse(jsonData!) as T;
      } catch {
        return jsonData;
      }
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return null;
    }
  }

  public static  append(key: string, item: any) {
    try {
      const existingArray = this.get(key);
      if (Array.isArray(existingArray)) {
        existingArray.push(item);
        this.set(key, JSON.stringify(existingArray));
      } else {
        this.set(key, JSON.stringify([item]));
      }
    } catch (error) {
      console.error('Error appending to array:', error);
    }
  }

  public static removeItemFromArray(key: string, callback: (item: any) => boolean) {
    try {
      const existingArray = this.get(key);
      if (Array.isArray(existingArray)) {
        const filteredArray = existingArray.filter(callback);
        this.set(key, JSON.stringify(filteredArray));
      }
    } catch (error) {
      console.error('Error removing item from array:', error);
    }
  }

  public static clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  public static getCachedData<T>(storageKey: string, onValid: (data: T) => void): boolean {
    const cachedData = this.get<{ data: T, expiresAt: number }>(storageKey);
    if (cachedData && typeof cachedData === 'object') {
      const { data, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        onValid(data);
        return true;
      }
    }
    return false;
  }

  public static cacheData(storageKey: string, data: object, ttl = Time.min): void {
    const expiresAt = Date.now() + ttl;
    this.set(storageKey, JSON.stringify({ data, expiresAt }));
  }
}


const ENCRYPTION_PREFIX = 'encrypt:';
const genEncryptionKey = (keyLength: number = 32) => {
    const keyArray = new Uint8Array(keyLength); 
    return crypto.getRandomValues(keyArray); 
}


// Encryption keys are stored in local storage instead of session for persistence reasons
export class EncryptedStorage {
  private _encrypt(key: string, value: string) {
    return encrypt(key, value);
  }

  private _decrypt(key: string, value: string) {
    return decrypt(key, value);
  }

  get<T>(key: string) {
    const encrypted = LocalStorage.get<T>(key);
    if (!encrypted) { return encrypted; }

    return this._decrypt(key, typeof encrypted === 'string' ? encrypted : JSON.stringify(encrypted));
  }

  remove(key: string) {
    const encryptionStorageKey = `${ENCRYPTION_PREFIX}${key}`;
    localStorage.remove(key);
    localStorage.remove(encryptionStorageKey);
  }

  set(key: string, value: string) {
    const encrypted = this._encrypt(key, value);
    localStorage.set(key, encrypted);
  }
}


export function encrypt (key: string, string: string){
  const encryptionKey = genEncryptionKey();
  const textBytes = AES.utils.utf8.toBytes(string);
  const aesCtr = new AES.ModeOfOperation.ctr(encryptionKey, new AES.Counter(5));
  const encryptedBytes = aesCtr.encrypt(textBytes);
  const encryptedText = AES.utils.hex.fromBytes(encryptedBytes);
  const storageKey = `${ENCRYPTION_PREFIX}${key}`;
  LocalStorage.set(storageKey, AES.utils.hex.fromBytes(encryptionKey));
  return encryptedText;
}

export function decrypt(key: string, encryptedText: string): string | null {
  const encryptStorageKey = `${ENCRYPTION_PREFIX}${key}`;
  const encryptionKeyStr = LocalStorage.get<string>(encryptStorageKey);
  if (!encryptionKeyStr) return null;
  const encryptionKey = AES.utils.hex.toBytes(encryptionKeyStr);
  const aesCtr = new AES.ModeOfOperation.ctr(encryptionKey, new AES.Counter(5));
  const encryptedBytes = AES.utils.hex.toBytes(encryptedText);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = AES.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

