import { describe, it, expect } from 'vitest';
import { checkSymptoms } from '../lib/symptom/checker';

describe('Symptom Checker', () => {
  it('should return emergency for severe symptoms', () => {
    const result = checkSymptoms(['difficulty_breathing']);
    expect(result.urgency).toBe('emergency');
  });

  it('should return urgent for high fever', () => {
    const result = checkSymptoms(['fever_high']);
    expect(result.urgency).toBe('urgent');
  });

  it('should return routine for mild symptoms', () => {
    const result = checkSymptoms(['cough']);
    expect(result.urgency).toBe('routine');
  });

  it('should return monitor for no symptoms', () => {
    const result = checkSymptoms([]);
    expect(result.urgency).toBe('monitor');
  });

  it('should include disclaimer in all results', () => {
    const result = checkSymptoms(['fever_mild']);
    expect(result.disclaimer).toBeTruthy();
    expect(result.disclaimer.length).toBeGreaterThan(0);
  });

  it('should provide actions for all urgency levels', () => {
    const result = checkSymptoms(['fever_high']);
    expect(result.actions).toBeTruthy();
    expect(result.actions.length).toBeGreaterThan(0);
  });
});
