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