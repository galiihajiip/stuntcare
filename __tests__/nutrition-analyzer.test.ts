import { describe, it, expect } from 'vitest';
import { analyzeNutrition, foodDatabase, getRecommendedMenu } from '../lib/nutrition/analyzer';

describe('Nutrition Analyzer', () => {
  it('should calculate total nutrition correctly', () => {
    const meals = [foodDatabase[0], foodDatabase[1]];
    const result = analyzeNutrition(meals);
    
    expect(result.calories).toBeGreaterThan(0);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.iron).toBeGreaterThan(0);
  });

  it('should provide recommendations for low protein', () => {
    const meals = [foodDatabase.find(f => f.category === 'Buah')!];
    const result = analyzeNutrition(meals);
    
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
  });

  it('should give high score for balanced meals', () => {
    const meals = [
      foodDatabase.find(f => f.name === 'Telur Ayam')!,
      foodDatabase.find(f => f.name === 'Bayam')!,
      foodDatabase.find(f => f.name === 'Pisang')!,
      foodDatabase.find(f => f.name === 'Tempe')!,
    ];
    const result = analyzeNutrition(meals);
    
    expect(result.score).toBeGreaterThan(70);
  });

  it('should generate recommended menu', () => {
    const menu = getRecommendedMenu(24, 'low');
    
    expect(menu.length).toBeGreaterThan(0);
    expect(menu.every(f => f.affordability === 'cheap')).toBe(true);
  });

  it('should include variety in recommended menu', () => {
    const menu = getRecommendedMenu(24, 'medium');
    
    const categories = new Set(menu.map(f => f.category));
    expect(categories.size).toBeGreaterThan(1);
  });
});
