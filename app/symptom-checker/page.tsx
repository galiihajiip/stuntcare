"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { symptoms, checkSymptoms, SymptomCheckResult } from "@/lib/symptom/checker";
import { AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";

export default function SymptomCheckerPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<SymptomCheckResult | null>(null);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleCheck = () => {
    const checkResult = checkSymptoms(selectedSymptoms);
    setResult(checkResult);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
      case "urgent":
        return <Clock className="h-8 w-8 text-orange-600" />;
      case "routine":
        return <Eye className="h-8 w-8 text-blue-600" />;
      default:
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "border-red-600 bg-red-50 dark:bg-red-950";
      case "urgent":
        return "border-orange-600 bg-orange-50 dark:bg-orange-950";
      case "routine":
        return "border-blue-600 bg-blue-50 dark:bg-blue-950";
      default:
        return "border-green-600 bg-green-50 dark:bg-green-950";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Symptom Checker</h1>
          <p className="text-muted-foreground">
            Alat bantu untuk menilai gejala anak. Bukan pengganti konsultasi medis profesional.
          </p>
        </div>

        {!result ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pilih Gejala yang Dialami</CardTitle>
                <CardDescription>
                  Pilih semua gejala yang sedang dialami anak Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedSymptoms.includes(symptom.id)
                          ? "border-primary bg-primary/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{symptom.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {symptom.category}
                          </p>
                        </div>
                        {selectedSymptoms.includes(symptom.id) && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleCheck}
                disabled={selectedSymptoms.length === 0}
                className="flex-1"
              >
                Cek Gejala ({selectedSymptoms.length})
              </Button>
              {selectedSymptoms.length > 0 && (
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <Card className={`mb-6 border-2 ${getUrgencyColor(result.urgency)}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {getUrgencyIcon(result.urgency)}
                  <div>
                    <CardTitle className="text-2xl">{result.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {result.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Langkah yang Perlu Dilakukan</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {result.actions.map((action, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {result.redFlags.length > 0 && (
              <Card className="mb-6 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Tanda Bahaya (Red Flags)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="mb-6 bg-slate-50 dark:bg-slate-900">
              <CardContent className="pt-6">
                <p className="text-sm text-center">
                  <strong>Disclaimer:</strong> {result.disclaimer}
                </p>
              </CardContent>
            </Card>

            <Button onClick={reset} variant="outline" className="w-full">
              Cek Gejala Lain
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
