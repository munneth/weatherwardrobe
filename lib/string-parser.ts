import { z } from 'zod';

// JSON parsing with validation
export const parseJsonString = <T>(jsonString: string, schema?: z.ZodSchema<T>): T | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (schema) {
      const validated = schema.parse(parsed);
      return validated;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

// CSV parsing
export const parseCSV = (csvString: string): string[] => {
  return csvString.split(',').map(item => item.trim()).filter(Boolean);
};

// URL parameters parsing
export const parseUrlParams = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  return Object.fromEntries(params);
};

// Custom delimiter parsing
export const parseDelimitedString = (
  delimitedString: string, 
  delimiter: string = ','
): string[] => {
  return delimitedString.split(delimiter).map(item => item.trim()).filter(Boolean);
};

// Number parsing with validation
export const parseNumberString = (numberString: string): number | null => {
  const parsed = parseFloat(numberString);
  return isNaN(parsed) ? null : parsed;
};

// Boolean parsing
export const parseBooleanString = (boolString: string): boolean => {
  const lower = boolString.toLowerCase();
  return lower === 'true' || lower === '1' || lower === 'yes';
};

// Date parsing
export const parseDateString = (dateString: string): Date | null => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// Array parsing (Python-style list strings)
export const parseArrayString = (arrayString: string): number[] | null => {
  try {
    return JSON.parse(arrayString);
  } catch (error) {
    console.error('Failed to parse array:', error);
    return null;
  }
};

// Alternative: Parse without JSON (for simple number arrays)
export const parseSimpleArray = (arrayString: string): number[] => {
  // Remove brackets and split by comma
  const cleanString = arrayString.replace(/[\[\]]/g, '');
  return cleanString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => parseFloat(item))
    .filter(num => !isNaN(num));
}; 