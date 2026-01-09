export interface NutritionAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminA: number;
  vitaminC: number;
  score: number;
  recommendations: string[];
}

export interface FoodItem {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminA: number;
  vitaminC: number;
  localAvailability: "high" | "medium" | "low";
  affordability: "cheap" | "moderate" | "expensive";
}

export const foodDatabase: FoodItem[] = [
  {
    name: "Telur Ayam",
    category: "Protein Hewani",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    iron: 1.8,
    calcium: 56,
    vitaminA: 540,
    vitaminC: 0,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Tempe",
    category: "Protein Nabati",
    calories: 193,
    protein: 20,
    carbs: 9,
    fat: 11,
    fiber: 0,
    iron: 2.7,
    calcium: 155,
    vitaminA: 0,
    vitaminC: 0,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Bayam",
    category: "Sayuran",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    iron: 2.7,
    calcium: 99,
    vitaminA: 9377,
    vitaminC: 28,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Pisang",
    category: "Buah",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    iron: 0.3,
    calcium: 5,
    vitaminA: 64,
    vitaminC: 8.7,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Ikan Kembung",
    category: "Protein Hewani",
    calories: 205,
    protein: 19,
    carbs: 0,
    fat: 14,
    fiber: 0,
    iron: 1.4,
    calcium: 20,
    vitaminA: 150,
    vitaminC: 0,
    localAvailability: "high",
    affordability: "moderate",
  },
  {
    name: "Wortel",
    category: "Sayuran",
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    fiber: 2.8,
    iron: 0.3,
    calcium: 33,
    vitaminA: 16706,
    vitaminC: 5.9,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Hati Ayam",
    category: "Protein Hewani",
    calories: 172,
    protein: 25,
    carbs: 0.9,
    fat: 7,
    fiber: 0,
    iron: 11,
    calcium: 11,
    vitaminA: 11078,
    vitaminC: 17,
    localAvailability: "high",
    affordability: "cheap",
  },
  {
    name: "Kacang Hijau",
    category: "Protein Nabati",
    calories: 347,
    protein: 24,
    carbs: 63,
    fat: 1.2,
    fiber: 16,
    iron: 6.7,
    calcium: 132,
    vitaminA: 114,
    vitaminC: 4.8,
    localAvailability: "high",
    affordability: "cheap",
  },
];

export function analyzeNutrition(meals: FoodItem[]): NutritionAnalysis {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
      fiber: acc.fiber + meal.fiber,
      iron: acc.iron + meal.iron,
      calcium: acc.calcium + meal.calcium,
      vitaminA: acc.vitaminA + meal.vitaminA,
      vitaminC: acc.vitaminC + meal.vitaminC,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      iron: 0,
      calcium: 0,
      vitaminA: 0,
      vitaminC: 0,
    }
  );

  const recommendations: string[] = [];
  let score = 100;

  // Protein check (minimum 50g for toddlers)
  if (totals.protein < 50) {
    recommendations.push("Tambahkan sumber protein seperti telur, tempe, atau ikan");
    score -= 15;
  }

  // Iron check (minimum 7mg for toddlers)
  if (totals.iron < 7) {
    recommendations.push("Perbanyak makanan kaya zat besi seperti hati ayam, bayam, atau kacang hijau");
    score -= 15;
  }

  // Vitamin A check (minimum 400 mcg for toddlers)
  if (totals.vitaminA < 400) {
    recommendations.push("Tambahkan sayuran berwarna seperti wortel atau bayam untuk vitamin A");
    score -= 10;
  }

  // Fiber check
  if (totals.fiber < 10) {
    recommendations.push("Perbanyak sayur dan buah untuk serat");
    score -= 10;
  }

  // Calcium check (minimum 500mg for toddlers)
  if (totals.calcium < 500) {
    recommendations.push("Tambahkan sumber kalsium seperti susu, tempe, atau ikan");
    score -= 10;
  }

  if (recommendations.length === 0) {
    recommendations.push("Nutrisi sudah sangat baik! Pertahankan pola makan ini");
  }

  return {
    ...totals,
    score: Math.max(0, score),
    recommendations,
  };
}

export function getRecommendedMenu(ageMonths: number, budget: "low" | "medium" | "high"): FoodItem[] {
  const affordabilityFilter = budget === "low" ? ["cheap"] : budget === "medium" ? ["cheap", "moderate"] : ["cheap", "moderate", "expensive"];

  const proteinSources = foodDatabase.filter(
    (f) => f.category === "Protein Hewani" || f.category === "Protein Nabati"
  ).filter((f) => affordabilityFilter.includes(f.affordability));

  const vegetables = foodDatabase.filter((f) => f.category === "Sayuran").filter((f) => affordabilityFilter.includes(f.affordability));

  const fruits = foodDatabase.filter((f) => f.category === "Buah").filter((f) => affordabilityFilter.includes(f.affordability));

  const menu: FoodItem[] = [];

  // Add 2 protein sources
  if (proteinSources.length >= 2) {
    menu.push(proteinSources[0], proteinSources[1]);
  }

  // Add 2 vegetables
  if (vegetables.length >= 2) {
    menu.push(vegetables[0], vegetables[1]);
  }

  // Add 1 fruit
  if (fruits.length >= 1) {
    menu.push(fruits[0]);
  }

  return menu;
}
