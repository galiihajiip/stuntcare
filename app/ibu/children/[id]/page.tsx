"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, TrendingUp, Calendar } from "lucide-react";
import { calculateAge } from "@/lib/growth/age-calculator";

export default function IbuChildDetailPage() {
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadChild = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data: childData } = await supabase
          .from("children")
          .select("*")
          .eq("id", params.id)
          .eq("parent_id", user.id)
          .single();

        if (!childData) {
          router.push("/ibu/dashboard");
          return;
        }

        setChild(childData);

        const { data: measurementsData } = await supabase
          .from("measurements")
          .select("*")
          .eq("child_id", params.id)
          .order("measurement_date", { ascending: false });

        setMeasurements(measurementsData || []);
      } catch (error) {
        console.error("Error loading child:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChild();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!child) return null;

  const age = calculateAge(child.date_of_birth);
  const latestMeasurement = measurements[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Baby className="h-8 w-8" />
            {child.full_name}
          </h1>
          <p className="text-muted-foreground">
            {child.gender === "male" ? "Laki-laki" : "Perempuan"} • {age.years} tahun {age.months} bulan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Status Stunting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                child.stunting_status === "normal" ? "text-green-600" :
                child.stunting_status === "at_risk" ? "text-orange-600" :
                "text-red-600"
              }`}>
                {child.stunting_status === "normal" ? "Normal" :
                 child.stunting_status === "at_risk" ? "Berisiko" :
                 "Stunting"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tinggi Badan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestMeasurement?.height || "-"} cm
              </div>
              <p className="text-xs text-muted-foreground">
                {latestMeasurement?.measurement_date 
                  ? new Date(latestMeasurement.measurement_date).toLocaleDateString("id-ID")
                  : "Belum ada data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Berat Badan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestMeasurement?.weight || "-"} kg
              </div>
              <p className="text-xs text-muted-foreground">
                {latestMeasurement?.measurement_date 
                  ? new Date(latestMeasurement.measurement_date).toLocaleDateString("id-ID")
                  : "Belum ada data"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Riwayat Pengukuran</span>
              <Calendar className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {measurements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data pengukuran</p>
            ) : (
              <div className="space-y-3">
                {measurements.map((m) => (
                  <div key={m.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(m.measurement_date).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        TB: {m.height} cm • BB: {m.weight} kg
                      </p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
