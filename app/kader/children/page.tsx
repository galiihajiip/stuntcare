"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Baby, Search, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function KaderChildrenPage() {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("posyandu_id")
          .eq("id", user.id)
          .single();

        if (!profile?.posyandu_id) return;

        const { data: childrenData } = await supabase
          .from("children")
          .select("*, profiles!children_parent_id_fkey(full_name)")
          .eq("posyandu_id", profile.posyandu_id)
          .order("created_at", { ascending: false });

        setChildren(childrenData || []);
      } catch (error) {
        console.error("Error loading children:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [router, supabase]);

  const filteredChildren = children.filter((child) =>
    child.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Daftar Anak</h1>
          <Link href="/kader/children/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anak
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama anak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <Card key={child.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  {child.full_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orang Tua:</span>
                    <span>{child.profiles?.full_name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Kelamin:</span>
                    <span>{child.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                  </div>
                  <div className="flex justify-between">
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
                </div>
                <Link href={`/kader/children/${child.id}`}>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChildren.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Baby className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? "Tidak ada anak yang ditemukan" : "Belum ada data anak"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
