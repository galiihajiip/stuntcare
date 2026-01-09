import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Users, Shield } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="text-2xl font-bold text-primary">STUNTCARE</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Pantau Tumbuh Kembang, Cegah Stunting Bersama
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Platform digital untuk Posyandu dan ibu balita dalam memantau pertumbuhan anak secara realtime dengan standar WHO
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register?role=kader">
                <Button size="lg" className="w-full sm:w-auto">
                  Untuk Kader Posyandu
                </Button>
              </Link>
              <Link href="/auth/register?role=ibu">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Untuk Ibu/Wali
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-teal-100 dark:bg-slate-700">
            {/* Placeholder untuk ilustrasi */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-32 w-32 text-teal-300 dark:text-teal-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-slate-800 rounded-3xl my-12">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Monitoring Pertumbuhan"
            description="Grafik pertumbuhan realtime dengan standar WHO dan deteksi dini risiko stunting"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8" />}
            title="Analisis Gizi"
            description="Rekomendasi menu lokal bergizi tinggi dan terjangkau untuk anak"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Komunitas Posyandu"
            description="Kolaborasi kader dan ibu dalam satu platform terintegrasi"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Data Aman"
            description="Privasi terjaga dengan enkripsi dan kontrol akses ketat"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Mulai Cegah Stunting Hari Ini</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan kader dan ibu yang telah mempercayai STUNTCARE untuk memantau tumbuh kembang anak
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="text-lg px-8">
            Daftar Gratis Sekarang
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-16">
        <div className="text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2026 STUNTCARE. Platform pencegahan stunting untuk Indonesia sehat.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
