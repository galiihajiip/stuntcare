import { describe, it, expect } from 'vitest';
import { calculateZScore, getStuntingStatus, getStatusLabel } from '../lib/growth/z-score';
import { WHOGrowthTable } from '../types/database';

describe('Z-Score Calculation', () => {
  // Mock WHO growth table data for testing
  const mockWHOData: WHOGrowthTable = {
    id: 'test-1',
    indicator: 'height_for_age',
    sex: 'L',
    age_months: 24,
    z_minus3: 78.0,
    z_minus2: 81.7,
    z_minus1: 84.8,
    z0: 87.8,
    z_plus1: 90.9,
    z_plus2: 94.0,
    z_plus3: 97.0
  };

  it('should calculate z-score for a normal child', () => {
    const result = calculateZScore(87.8, mockWHOData); // Exactly at z0
    
    expect(result).toBe(0);
  });

  it('should detect stunting for low height', () => {
    const result = calculateZScore(80.0, mockWHOData); // Between z-3 and z-2
    
    expect(result).toBeLessThan(-2);
    expect(result).toBeGreaterThan(-3);
  });

  it('should calculate positive z-scores', () => {
    const result = calculateZScore(92.0, mockWHOData); // Between z+1 and z+2
    
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(2);
  });

  it('should return valid numbers', () => {
    const result = calculateZScore(85.0, mockWHOData);
    
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  it('should determine stunting status correctly', () => {
    expect(getStuntingStatus(-3.5)).toBe('severe_stunting');
    expect(getStuntingStatus(-2.5)).toBe('stunting');
    expect(getStuntingStatus(-1.7)).toBe('risiko');
    expect(getStuntingStatus(0)).toBe('normal');
  });

  it('should return correct status labels', () => {
    expect(getStatusLabel('normal')).toBe('Normal');
    expect(getStatusLabel('risiko')).toBe('Berisiko');
    expect(getStatusLabel('stunting')).toBe('Stunting');
    expect(getStatusLabel('severe_stunting')).toBe('Stunting Berat');
  });
});
