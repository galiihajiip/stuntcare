"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2 } from "lucide-react";

export default function JoinCommunityPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      const { data: community, error: communityError } = await supabase
        .from("communities")
        .select("id, name")
        .eq("invite_code", inviteCode.toUpperCase())
        .single();

      if (communityError || !community) {
        throw new Error("Kode komunitas tidak valid");
      }

      const { error: memberError } = await supabase
        .from("community_members")
        .insert({
          community_id: community.id,
          profile_id: user.id,
          role_in_community: "member",
        });

      if (memberError) {
        if (memberError.code === "23505") {
          throw new Error("Anda sudah bergabung dengan komunitas ini");
        }
        throw memberError;
      }

      toast({
        title: "Berhasil bergabung!",
        description: `Selamat datang di ${community.name}`,
      });

      router.push("/ibu/dashboard");
    } catch (error: any) {
      toast({
        title: "Gagal bergabung",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Bergabung dengan Komunitas</CardTitle>
          </div>
          <CardDescription>
            Masukkan kode undangan dari kader posyandu Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Kode Undangan</Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Contoh: ABC12345"
                maxLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Kode terdiri dari 8 karakter huruf dan angka
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Bergabung
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
