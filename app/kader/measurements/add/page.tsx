"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Loader2 } from "lucide-react";
import { calculateZScore } from "@/lib/growth/z-score";
import { calculateAge } from "@/lib/growth/age-calculator";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AddMeasurementPage() {
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [formData, setFormData] = useState({
    child_id: "",
    measurement_date: new Date().toISOString().split("T")[0],
    weight: "",
    height: "",
    head_circumference: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const loadChildren = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("posyandu_id")
        .eq("id", user.id)
        .single();

      if (!profile?.posyandu_id) return;

      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("posyandu_id", profile.posyandu_id)
        .order("full_name");

      setChildren(childrenData || []);

      const preselectedId = searchParams.get("child_id");
      if (preselectedId) {
        const child = childrenData?.find((c) => c.id === preselectedId);
        if (child) {
          setSelectedChild(child);
          setFormData({ ...formData, child_id: preselectedId });
        }
      }
    };

    loadChildren();
  }, [searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedChild) throw new Error("Pilih anak terlebih dahulu");

      const age = calculateAge(selectedChild.date_of_birth);
      const ageInMonths = age.years * 12 + age.months;

      // For now, we'll use simplified z-score calculation
      // In production, this should fetch WHO growth tables from database
      const heightZScore = 0; // Placeholder - should calculate from WHO tables
      const weightZScore = 0; // Placeholder - should calculate from WHO tables
      const weightHeightZScore = 0; // Placeholder - should calculate from WHO tables

      let stuntingStatus = "normal";
      if (heightZScore < -3) {
        stuntingStatus = "stunted";
      } else if (heightZScore < -2) {
        stuntingStatus = "at_risk";
      }

      const { error: measurementError } = await supabase.from("measurements").insert({
        child_id: formData.child_id,
        measurement_date: formData.measurement_date,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        head_circumference: formData.head_circumference ? parseFloat(formData.head_circumference) : null,
        z_score_height_age: heightZScore,
        z_score_weight_age: weightZScore,
        z_score_weight_height: weightHeightZScore,
      });

      if (measurementError) throw measurementError;

      const { error: childError } = await supabase
        .from("children")
        .update({ stunting_status: stuntingStatus })
        .eq("id", formData.child_id);

      if (childError) throw childError;

      toast({
        title: "Berhasil!",
        description: "Data pengukuran berhasil disimpan",
      });

      router.push(`/kader/children/${formData.child_id}`);
    } catch (error: any) {
      toast({
        title: "Gagal menyimpan pengukuran",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <CardTitle>Tambah Pengukuran</CardTitle>
            </div>
            <CardDescription>
              Input data pengukuran tinggi dan berat badan anak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="child_id">Pilih Anak</Label>
                <select
                  id="child_id"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.child_id}
                  onChange={(e) => {
                    const child = children.find((c) => c.id === e.target.value);
                    setSelectedChild(child);
                    setFormData({ ...formData, child_id: e.target.value });
                  }}
                  required
                >
                  <option value="">-- Pilih Anak --</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.full_name} ({child.gender === "male" ? "L" : "P"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurement_date">Tanggal Pengukuran</Label>
                <Input
                  id="measurement_date"
                  type="date"
                  value={formData.measurement_date}
                  onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Berat Badan (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="head_circumference">Lingkar Kepala (cm) - Opsional</Label>
                <Input
                  id="head_circumference"
                  type="number"
                  step="0.1"
                  value={formData.head_circumference}
                  onChange={(e) => setFormData({ ...formData, head_circumference: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
