"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, TrendingUp, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function IbuDashboard() {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
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

        // Get children
        const { data: childrenData } = await supabase
          .from("children")
          .select("*")
          .eq("parent_id", user.id)
          .order("created_at", { ascending: false });

        setChildren(childrenData || []);
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
            <h1 className="text-3xl font-bold">Dashboard Ibu</h1>
            <p className="text-muted-foreground">Pantau tumbuh kembang anak Anda</p>
          </div>
          <Link href="/ibu/children/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anak
            </Button>
          </Link>
        </div>

        {children.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Belum Ada Data Anak</CardTitle>
              <CardDescription>
                Mulai dengan menambahkan data anak Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ibu/children/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Anak Pertama
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="h-5 w-5" />
                    {child.full_name}
                  </CardTitle>
                  <CardDescription>
                    {child.gender === "male" ? "Laki-laki" : "Perempuan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${
                        child.stunting_status === "normal" ? "text-green-600" :
                        child.stunting_status === "at_risk" ? "text-orange-600" :
                        "text-red-600"
                      }`}>
                        {child.stunting_status === "normal" ? "Normal" :
                         child.stunting_status === "at_risk" ? "Berisiko" :
                         "Stunting"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tanggal Lahir:</span>
                      <span>{new Date(child.date_of_birth).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <Link href={`/ibu/children/${child.id}`}>
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Posyandu</CardTitle>
              <CardDescription>Jangan lewatkan jadwal pemeriksaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Pemeriksaan Rutin</p>
                  <p className="text-sm text-muted-foreground">Setiap tanggal 10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips Gizi</CardTitle>
              <CardDescription>Rekomendasi untuk anak Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Pastikan anak mendapat asupan protein, vitamin, dan mineral yang cukup setiap hari.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
