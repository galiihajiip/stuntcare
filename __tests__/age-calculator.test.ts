import { describe, it, expect } from 'vitest';
import { calculateAge } from '../lib/growth/age-calculator';

describe('Age Calculator', () => {
  it('should calculate age correctly', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 2);
    birthDate.setMonth(birthDate.getMonth() - 3);
    
    const result = calculateAge(birthDate.toISOString().split('T')[0]);
    
    expect(result.years).toBe(2);
    expect(result.months).toBe(3);
  });

  it('should handle newborns', () => {
    const birthDate = new Date();
    birthDate.setMonth(birthDate.getMonth() - 2);
    
    const result = calculateAge(birthDate.toISOString().split('T')[0]);
    
    expect(result.years).toBe(0);
    expect(result.months).toBe(2);
  });

  it('should calculate total months correctly', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 2);
    birthDate.setMonth(birthDate.getMonth() - 6);
    
    const result = calculateAge(birthDate.toISOString().split('T')[0]);
    
    expect(result.totalMonths).toBe(30);
  });
});
