"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { foodDatabase, analyzeNutrition, getRecommendedMenu, FoodItem } from "@/lib/nutrition/analyzer";
import { Apple, Plus, Trash2 } from "lucide-react";

export default function NutritionAnalyzerPage() {
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  const addFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food]);
  };

  const removeFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    const result = analyzeNutrition(selectedFoods);
    setAnalysis(result);
  };

  const loadRecommendedMenu = () => {
    const menu = getRecommendedMenu(24, "low");
    setSelectedFoods(menu);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Apple className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Analisis Nutrisi</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Pilih Makanan</CardTitle>
              <CardDescription>Tambahkan makanan yang dikonsumsi hari ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {foodDatabase.map((food, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div>
                    <p className="font-medium">{food.name}</p>
                    <p className="text-xs text-muted-foreground">{food.category}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => addFood(food)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menu Hari Ini</CardTitle>
              <CardDescription>
                {selectedFoods.length} item dipilih
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedFoods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Belum ada makanan dipilih</p>
                  <Button variant="outline" onClick={loadRecommendedMenu}>
                    Muat Menu Rekomendasi
                  </Button>
                </div>
              ) : (
                <>
                  {selectedFoods.map((food, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{food.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeFood(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button className="w-full mt-4" onClick={handleAnalyze}>
                    Analisis Nutrisi
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Analisis</CardTitle>
              <CardDescription>
                Skor Nutrisi: <span className={`text-2xl font-bold ${
                  analysis.score >= 80 ? "text-green-600" :
                  analysis.score >= 60 ? "text-orange-600" : "text-red-600"
                }`}>{analysis.score}/100</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <p className="text-sm text-muted-foreground">Kalori</p>
                  <p className="text-2xl font-bold">{analysis.calories.toFixed(0)}</p>
                  <p className="text-xs">kcal</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-2xl font-bold">{analysis.protein.toFixed(1)}</p>
                  <p className="text-xs">gram</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-sm text-muted-foreground">Zat Besi</p>
                  <p className="text-2xl font-bold">{analysis.iron.toFixed(1)}</p>
                  <p className="text-xs">mg</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rekomendasi:</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
