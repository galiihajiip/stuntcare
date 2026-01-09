import { Heart, LayoutDashboard, Baby, TrendingUp, FileText, Users, Calendar, Megaphone, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function KaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r overflow-y-auto">
        <div className="p-6">
          <Link href="/kader/dashboard" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">STUNTCARE</span>
          </Link>
        </div>
        <nav className="px-4 space-y-2 pb-6">
          <Link href="/kader/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/kader/children" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Baby className="h-5 w-5" />
            <span>Daftar Anak</span>
          </Link>
          <Link href="/kader/measurements/add" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <TrendingUp className="h-5 w-5" />
            <span>Input Pengukuran</span>
          </Link>
          <Link href="/kader/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <FileText className="h-5 w-5" />
            <span>Laporan</span>
          </Link>
          <Link href="/kader/community" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Users className="h-5 w-5" />
            <span>Komunitas</span>
          </Link>
          <Link href="/kader/feed" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <MessageSquare className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link href="/kader/announcements" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Megaphone className="h-5 w-5" />
            <span>Pengumuman</span>
          </Link>
          <Link href="/kader/events" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Calendar className="h-5 w-5" />
            <span>Event</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
