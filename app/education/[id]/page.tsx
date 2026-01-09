"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EducationDetailPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data: contentData } = await supabase
          .from("education_contents")
          .select("*")
          .eq("id", params.id)
          .single();

        if (!contentData) {
          router.push("/education");
          return;
        }

        setContent(contentData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("*")
            .eq("profile_id", user.id)
            .eq("content_id", params.id)
            .single();

          setCompleted(!!progressData);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [params.id, router, supabase]);

  const markAsCompleted = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("user_progress").insert({
        profile_id: user.id,
        content_id: params.id as string,
      });

      if (error && error.code !== "23505") throw error;

      setCompleted(true);
      toast({
        title: "Selesai!",
        description: "Konten telah ditandai sebagai selesai",
      });
    } catch (error: any) {
      toast({
        title: "Gagal",
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

  if (!content) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-3xl">{content.title}</CardTitle>
              {completed && (
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {content.category}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                {content.reading_time || 5} menit
              </span>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{content.content_md}</div>

            {!completed && (
              <div className="mt-8 pt-8 border-t">
                <Button onClick={markAsCompleted} className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Tandai Sebagai Selesai
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
