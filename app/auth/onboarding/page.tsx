"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Loader2, MapPin, Building2 } from "lucide-react";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "kader" | "ibu" | null;
  
  const [loading, setLoading] = useState(false);
  const [posyanduName, setPosyanduName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [router, supabase]);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      if (role === "kader") {
        // Create posyandu
        const { data: posyandu, error: posyanduError } = await supabase
          .from("posyandu")
          .insert({
            name: posyanduName,
            address,
            province,
            city,
            district,
          })
          .select()
          .single();

        if (posyanduError) throw posyanduError;

        // Update profile with posyandu_id
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ posyandu_id: posyandu.id })
          .eq("id", user.id);

        if (profileError) throw profileError;

        toast({
          title: "Onboarding selesai!",
          description: "Posyandu berhasil didaftarkan",
        });

        router.push("/kader/dashboard");
      } else {
        // For ibu, just redirect to dashboard
        toast({
          title: "Selamat datang!",
          description: "Akun Anda siap digunakan",
        });

        router.push("/ibu/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Gagal menyelesaikan onboarding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (role === "ibu") {
    // Auto-redirect for ibu role
    useEffect(() => {
      router.push("/ibu/dashboard");
    }, [router]);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-primary" fill="currentColor" />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Daftarkan Posyandu Anda</CardTitle>
            <CardDescription>
              Lengkapi informasi posyandu untuk memulai
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOnboarding} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="posyanduName">Nama Posyandu</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="posyanduName"
                  type="text"
                  placeholder="Posyandu Melati"
                  value={posyanduName}
                  onChange={(e) => setPosyanduName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Jl. Contoh No. 123"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi</Label>
                <Input
                  id="province"
                  type="text"
                  placeholder="Jawa Barat"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota/Kabupaten</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Bandung"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Kecamatan</Label>
              <Input
                id="district"
                type="text"
                placeholder="Coblong"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Selesai
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}