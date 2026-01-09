"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FeedPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [communityId, setCommunityId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: membership } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("profile_id", user.id)
          .single();

        if (!membership) return;
        setCommunityId(membership.community_id);

        const { data: postsData } = await supabase
          .from("posts")
          .select("*, profiles(full_name, avatar_url)")
          .eq("community_id", membership.community_id)
          .order("created_at", { ascending: false });

        setPosts(postsData || []);

        const channel = supabase
          .channel("posts")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "posts",
              filter: `community_id=eq.${membership.community_id}`,
            },
            () => {
              loadFeed();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [supabase]);

  const handlePost = async () => {
    if (!newPost.trim() || !communityId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("posts").insert({
        community_id: communityId,
        author_id: user.id,
        content: newPost,
      });

      if (error) throw error;

      setNewPost("");
      toast({
        title: "Postingan berhasil!",
        description: "Postingan Anda telah dipublikasikan",
      });
    } catch (error: any) {
      toast({
        title: "Gagal memposting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Feed Komunitas</h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Bagikan sesuatu dengan komunitas..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePost()}
              />
              <Button onClick={handlePost} disabled={!newPost.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {post.profiles?.full_name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{post.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                <div className="flex gap-4 text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-primary">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Suka</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">Komentar</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Belum ada postingan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
