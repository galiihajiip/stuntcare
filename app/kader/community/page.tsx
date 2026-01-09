"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CommunityManagementPage() {
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data: membership } = await supabase
          .from("community_members")
          .select("community_id, communities(*)")
          .eq("profile_id", user.id)
          .eq("role_in_community", "admin")
          .single();

        if (!membership) {
          router.push("/kader/dashboard");
          return;
        }

        setCommunity(membership.communities);

        const { data: membersData } = await supabase
          .from("community_members")
          .select("*, profiles(full_name, phone)")
          .eq("community_id", membership.community_id)
          .order("joined_at", { ascending: false });

        setMembers(membersData || []);
      } catch (error) {
        console.error("Error loading community:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [router, supabase]);

  const copyInviteCode = () => {
    if (community?.invite_code) {
      navigator.clipboard.writeText(community.invite_code);
      setCopied(true);
      toast({
        title: "Kode disalin!",
        description: "Kode undangan telah disalin ke clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!community) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manajemen Komunitas</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Komunitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{community.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{community.address || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kontak</p>
                <p className="font-medium">{community.contact_phone || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kode Undangan</CardTitle>
              <CardDescription>
                Bagikan kode ini kepada ibu untuk bergabung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold tracking-wider">{community.invite_code}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyInviteCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Anggota ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{member.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role_in_community === "admin" ? "Admin" :
                       member.role_in_community === "kader" ? "Kader" : "Anggota"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(member.joined_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
