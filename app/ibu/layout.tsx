import { Heart, LayoutDashboard, Baby, Calendar, BookOpen, Apple, Stethoscope, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function IbuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r overflow-y-auto">
        <div className="p-6">
          <Link href="/ibu/dashboard" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">STUNTCARE</span>
          </Link>
        </div>
        <nav className="px-4 space-y-2 pb-6">
          <Link href="/ibu/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/ibu/children/add" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Baby className="h-5 w-5" />
            <span>Tambah Anak</span>
          </Link>
          <Link href="/communities/join" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <MessageSquare className="h-5 w-5" />
            <span>Gabung Komunitas</span>
          </Link>
          <Link href="/education" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <BookOpen className="h-5 w-5" />
            <span>Edukasi</span>
          </Link>
          <Link href="/nutrition/analyzer" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Apple className="h-5 w-5" />
            <span>Analisis Gizi</span>
          </Link>
          <Link href="/symptom-checker" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Stethoscope className="h-5 w-5" />
            <span>Cek Gejala</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
