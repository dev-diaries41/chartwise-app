import { BaseFilterOptions } from "@src/types";

export function getDateFilter(filterDate?: string | number): Record<string, any> | undefined {
    if (filterDate === undefined) return undefined;
  
    const timestamp = typeof filterDate === 'string' ? parseInt(filterDate, 10) : filterDate;
    if (isNaN(timestamp)) {
      throw new Error('Invalid filterDate format');
    }
  
    const startOfDay = new Date(timestamp);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(timestamp);
    endOfDay.setUTCHours(23, 59, 59, 999);
  
    return {
      timestamp: {
        $gte: startOfDay.getTime(),
        $lte: endOfDay.getTime(),
      },
    };
  }


export function getDateRangeFilter(startDate?: string | number, endDate?: string | number): Record<string, any> | undefined {
    if (startDate === undefined && endDate === undefined) return undefined;
  
    const parseDate = (date: string | number | undefined): number | undefined => {
      if (date === undefined) return undefined;
      const timestamp = typeof date === 'string' ? parseInt(date, 10) : date;
      return isNaN(timestamp) ? undefined : timestamp;
    };
  
    const startTimestamp = parseDate(startDate);
    const endTimestamp = parseDate(endDate);
  
    if (startTimestamp === undefined && endTimestamp === undefined) {
      return undefined;
    }
  
    if (startTimestamp === undefined || endTimestamp === undefined) {
      throw new Error('Both startDate and endDate must be provided, and both must be valid.');
    }
  
    const startOfDay = new Date(startTimestamp);
    startOfDay.setUTCHours(0, 0, 0, 0);
  
    const endOfDay = new Date(endTimestamp);
    endOfDay.setUTCHours(23, 59, 59, 999);
  
    return {
      timestamp: {
        $gte: startOfDay.getTime(),
        $lte: endOfDay.getTime(),
      },
    };
  }
  
  export function getCategoryFilter(category?: string): Record<string, any> | undefined {
    if (category === undefined || category.trim() === '') return undefined;
  
    return {
      category: category.trim(),
    };
  }

  export function getCategoryAndDateFilter(category?: string, filterDate?: string | number): Record<string, any> | undefined {
    const categoryFilter = getCategoryFilter(category);
    const dateFilter = getDateFilter(filterDate);
  
    if (categoryFilter === undefined && dateFilter === undefined) return undefined;
  
    return {
      ...(categoryFilter || {}),
      ...(dateFilter || {}),
    };
  }

  export function getCategoryAndDateRangeFilter(category?: string, startDate?: string | number, endDate?: string | number): Record<string, any> | undefined {
    const categoryFilter = getCategoryFilter(category);
    const dateRangeFilter = getDateRangeFilter(startDate, endDate);
  
    if (categoryFilter === undefined && dateRangeFilter === undefined) return undefined;
  
    return {
      ...(categoryFilter || {}),
      ...(dateRangeFilter || {}),
    };
  }
  

export function getFilter(options: BaseFilterOptions): Record<string, any> | undefined {
    const { category, filterDate, startDate, endDate } = options;
  
    let filter: Record<string, any> = {};
  
    switch (true) {
      case !!category && !!filterDate:
        filter = getCategoryAndDateFilter(category, filterDate) || {};
        break;
      case !!category && !!startDate && !!endDate:
        filter = getCategoryAndDateRangeFilter(category, startDate, endDate) || {};
        break;
      case !!filterDate:
        filter = getDateFilter(filterDate) || {};
        break;
      case !!startDate && !!endDate:
        filter = getDateRangeFilter(startDate, endDate) || {};
        break;
      case !!category:
        filter = getCategoryFilter(category) || {};
        break;
    }
  
    return Object.keys(filter).length ? filter : undefined;
  }
  