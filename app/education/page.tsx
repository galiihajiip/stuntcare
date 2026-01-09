"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EducationPage() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<any[]>([]);
  const [progress, setProgress] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: contentsData } = await supabase
          .from("education_contents")
          .select("*")
          .order("created_at", { ascending: false });

        setContents(contentsData || []);

        if (user) {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("content_id")
            .eq("profile_id", user.id);

          setProgress(new Set(progressData?.map((p) => p.content_id) || []));
        }
      } catch (error) {
        console.error("Error loading education:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, [supabase]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      gizi: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      sanitasi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      imunisasi: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      pola_asuh: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[category] || "bg-slate-100 text-slate-800";
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edukasi Kesehatan</h1>
          <p className="text-muted-foreground">
            Pelajari tentang gizi, sanitasi, imunisasi, dan pola asuh anak
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(content.category)}`}>
                    {content.category}
                  </span>
                  {progress.has(content.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <CardTitle className="line-clamp-2">{content.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.reading_time || 5} menit</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/education/${content.id}`}>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {progress.has(content.id) ? "Baca Lagi" : "Mulai Belajar"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {contents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Konten edukasi akan segera tersedia</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
