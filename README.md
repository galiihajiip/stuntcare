# STUNTCARE - Platform Pencegahan Stunting

Platform digital untuk Posyandu dan ibu balita dalam memantau pertumbuhan anak secara realtime dengan standar WHO.

## 🌟 Fitur Utama

### Untuk Kader Posyandu
- ✅ Dashboard monitoring dengan statistik lengkap
- ✅ Manajemen data anak di posyandu
- ✅ Input dan tracking pengukuran (tinggi, berat, lingkar kepala)
- ✅ Deteksi dini risiko stunting dengan Z-Score WHO
- ✅ Laporan dan analisis data stunting
- ✅ Manajemen komunitas dengan kode undangan
- ✅ Feed komunitas dan pengumuman
- ✅ Penjadwalan event posyandu

### Untuk Ibu/Wali
- ✅ Dashboard personal untuk monitoring anak
- ✅ Riwayat pertumbuhan anak dengan grafik
- ✅ Bergabung komunitas via kode undangan
- ✅ Notifikasi jadwal posyandu
- ✅ Tips gizi dan nutrisi
- ✅ Analisis nutrisi makanan
- ✅ Symptom checker dengan triage aman
- ✅ Konten edukasi kesehatan

### Fitur Tambahan
- 🔄 Realtime sync (Kader input → Ibu lihat langsung)
- 📱 PWA (Progressive Web App) - Install seperti aplikasi native
- 🌙 Dark mode support
- 📴 Offline-first - Tetap bisa diakses tanpa internet
- 🔒 Keamanan data dengan RLS (Row Level Security)
- 📊 WHO Growth Standards integration
- 🎓 Gamifikasi pembelajaran
- 🍎 Database makanan lokal Indonesia

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account
- Vercel account (untuk deployment)

## 🛠️ Setup Development

### 1. Clone repository

```bash
git clone https://github.com/your-username/stuntcare.git
cd stuntcare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan migrations:
   - Buka SQL Editor di Supabase Dashboard
   - Copy & run `supabase/migrations/001_initial_schema.sql`
   - Copy & run `supabase/migrations/002_rls_policies.sql`

3. Enable Realtime:
   - Database → Replication
   - Enable untuk tables: `posts`, `visits`, `announcements`, `events`

4. Configure Auth:
   - Authentication → Providers
   - Enable Email
   - (Optional) Enable Google OAuth

### 5. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run E2E in UI mode
npm run test:e2e -- --ui
```

## 📦 Build & Deploy

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Atau connect repository di Vercel Dashboard untuk auto-deployment.

## 📁 Struktur Project

```
stuntcare/
├── app/                      # Next.js App Router
│   ├── auth/                # Authentication pages
│   ├── kader/               # Kader dashboard & features
│   ├── ibu/                 # Ibu dashboard & features
│   ├── communities/         # Community management
│   ├── education/           # Education content
│   ├── nutrition/           # Nutrition analyzer
│   ├── symptom-checker/     # Symptom checker
│   └── layout.tsx           # Root layout
├── components/              # React components
│   └── ui/                  # Reusable UI components
├── lib/                     # Business logic & utilities
│   ├── growth/              # Growth calculation (Z-Score, Age)
│   ├── nutrition/           # Nutrition analyzer
│   ├── symptom/             # Symptom checker
│   └── supabase/            # Supabase clients
├── supabase/
│   └── migrations/          # Database migrations
├── types/                   # TypeScript types
├── public/                  # Static assets
├── __tests__/               # Unit tests
├── e2e/                     # E2E tests
└── docs/                    # Documentation
```

## 📖 Documentation

- [User Guide](USER_GUIDE.md) - Panduan lengkap untuk pengguna
- [Deployment Guide](DEPLOYMENT.md) - Panduan deployment
- [Contributing](CONTRIBUTING.md) - Panduan kontribusi
- [Changelog](CHANGELOG.md) - Riwayat perubahan

## 🔐 Security

- Row Level Security (RLS) pada semua tabel
- Role-based access control
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- HTTPS enforcement
- Environment variables protection

## 🎯 Roadmap

### v1.1 (Q2 2026)
- [ ] Push notifications
- [ ] SMS reminders
- [ ] Advanced analytics
- [ ] Export to PDF
- [ ] Multi-language support

### v1.2 (Q3 2026)
- [ ] Voice input untuk pengukuran
- [ ] Photo upload untuk tracking
- [ ] Telemedicine consultation
- [ ] AI-powered recommendations

### v2.0 (Q4 2026)
- [ ] Integration dengan sistem Kemenkes
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Predictive analytics

## 🤝 Contributing

Kami menerima kontribusi! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan.

### Contributors

Terima kasih kepada semua kontributor yang telah membantu mengembangkan STUNTCARE!

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- WHO untuk growth standards
- Kemenkes RI untuk panduan stunting
- Komunitas open source
- Semua kader dan ibu yang telah memberikan feedback

## 📞 Support

Jika ada pertanyaan atau masalah:
- 📧 Email: support@stuntcare.id
- 💬 GitHub Issues: [Create an issue](https://github.com/your-username/stuntcare/issues)
- 📱 WhatsApp: 08xx-xxxx-xxxx

## 🌐 Links

- Website: https://stuntcare.vercel.app
- Documentation: https://docs.stuntcare.id
- API Docs: https://api.stuntcare.id/docs

---

**Mari bersama cegah stunting untuk Indonesia sehat!** 🇮🇩

Made with ❤️ for Indonesia

