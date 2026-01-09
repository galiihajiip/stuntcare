import { WifiOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle>Tidak Ada Koneksi</CardTitle>
          <CardDescription>
            Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Data yang telah dimuat sebelumnya masih dapat diakses. Koneksi akan otomatis tersambung kembali saat internet tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
