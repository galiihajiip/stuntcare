"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Baby, TrendingUp, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

export default function KaderDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    atRisk: 0,
    recentMeasurements: 0,
    posyanduName: "",
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Get profile with posyandu
        const { data: profile } = await supabase
          .from("profiles")
          .select("*, posyandu(*)")
          .eq("id", user.id)
          .single();

        if (!profile?.posyandu_id) {
          router.push("/auth/onboarding?role=kader");
          return;
        }

        // Get children count
        const { count: childrenCount } = await supabase
          .from("children")
          .select("*", { count: "exact", head: true })
          .eq("posyandu_id", profile.posyandu_id);

        // Get at-risk children
        const { count: atRiskCount } = await supabase
          .from("children")
          .select("*", { count: "exact", head: true })
          .eq("posyandu_id", profile.posyandu_id)
          .eq("stunting_status", "stunted");

        setStats({
          totalChildren: childrenCount || 0,
          atRisk: atRiskCount || 0,
          recentMeasurements: 0,
          posyanduName: profile.posyandu?.name || "",
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Kader</h1>
            <p className="text-muted-foreground">{stats.posyanduName}</p>
          </div>
          <Link href="/kader/children/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anak
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anak</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChildren}</div>
              <p className="text-xs text-muted-foreground">Terdaftar di posyandu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Berisiko Stunting</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.atRisk}</div>
              <p className="text-xs text-muted-foreground">Perlu perhatian khusus</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengukuran Bulan Ini</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentMeasurements}</div>
              <p className="text-xs text-muted-foreground">Data terbaru</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ibu Terdaftar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Anggota aktif</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Fitur yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/kader/children">
                <Button variant="outline" className="w-full justify-start">
                  <Baby className="mr-2 h-4 w-4" />
                  Lihat Daftar Anak
                </Button>
              </Link>
              <Link href="/kader/measurements/add">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Input Pengukuran
                </Button>
              </Link>
              <Link href="/kader/reports">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Laporan Stunting
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anak Berisiko Tinggi</CardTitle>
              <CardDescription>Memerlukan perhatian segera</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats.atRisk === 0 
                  ? "Tidak ada anak berisiko tinggi saat ini" 
                  : `${stats.atRisk} anak memerlukan perhatian khusus`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
