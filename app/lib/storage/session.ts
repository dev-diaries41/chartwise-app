export function set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }
  
  export function remove(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from storage:', error);
    }
  }
  
  export function get<T>(key: string): T|string|null {
    try {
      const jsonData = sessionStorage.getItem(key);
      try {
        return JSON.parse(jsonData!) as T;
      } catch {
        // If parsing fails, return the plain string
        return jsonData;
      }
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return null;
    }
  }
  
  export function append(key: string, item: any) {
    try {
      const existingArray = get(key);
      if (Array.isArray(existingArray)) {
        existingArray.push(item);
        set(key, JSON.stringify(existingArray));
      } else {
        set(key, JSON.stringify([item]));
      }
    } catch (error) {
      console.error('Error appending to array:', error);
    }
  }
  
  export function removeItemFromArray(key: string, callback: (item: any) => boolean) {
    try {
      const existingArray = get(key);
      if (Array.isArray(existingArray)) {
        const filteredArray = existingArray.filter(callback);
        set(key, JSON.stringify(filteredArray));
      }
    } catch (error) {
      console.error('Error removing item from array:', error);
    }
  }
  
  export function clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
  