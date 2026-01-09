"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    atRisk: 0,
    stunted: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("posyandu_id")
          .eq("id", user.id)
          .single();

        if (!profile?.posyandu_id) return;

        const { data: children } = await supabase
          .from("children")
          .select("stunting_status")
          .eq("posyandu_id", profile.posyandu_id);

        const total = children?.length || 0;
        const normal = children?.filter((c: any) => c.stunting_status === "normal").length || 0;
        const atRisk = children?.filter((c: any) => c.stunting_status === "at_risk").length || 0;
        const stunted = children?.filter((c: any) => c.stunting_status === "stunted").length || 0;

        setStats({ total, normal, atRisk, stunted });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [supabase]);

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
            <h1 className="text-3xl font-bold">Laporan Stunting</h1>
            <p className="text-muted-foreground">Statistik dan analisis data posyandu</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Anak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">Normal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.normal}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-orange-600">Berisiko</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.atRisk}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.atRisk / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-red-600">Stunting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.stunted}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.stunted / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Laporan</CardTitle>
            <CardDescription>Data per {new Date().toLocaleDateString("id-ID")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium">Status Baik</p>
                <p className="text-sm text-muted-foreground">
                  {stats.normal} anak dalam kondisi pertumbuhan normal
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <p className="font-medium">Perlu Perhatian</p>
                <p className="text-sm text-muted-foreground">
                  {stats.atRisk + stats.stunted} anak memerlukan intervensi gizi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
