# Supabase Setup Guide

## Prerequisites
- Akun Supabase (https://supabase.com)
- Project Supabase sudah dibuat

## Step 1: Jalankan Database Migrations

### 1.1 Buka Supabase Dashboard
1. Login ke https://supabase.com/dashboard
2. Pilih project **stuntcare** Anda

### 1.2 Jalankan Migration 001 (Initial Schema)
1. Klik **SQL Editor** di sidebar kiri
2. Klik **New Query**
3. Copy seluruh isi file `supabase/migrations/001_initial_schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl+Enter`
6. Tunggu sampai selesai (akan muncul "Success")

### 1.3 Jalankan Migration 002 (RLS Policies)
1. Klik **New Query** lagi
2. Copy seluruh isi file `supabase/migrations/002_rls_policies.sql`
3. Paste ke SQL Editor
4. Klik **Run** atau tekan `Ctrl+Enter`
5. Tunggu sampai selesai

### 1.4 Verifikasi Tables
1. Klik **Table Editor** di sidebar
2. Pastikan tables berikut sudah ada:
   - profiles
   - communities
   - community_members
   - children
   - guardians
   - visits
   - immunizations
   - nutrition_logs
   - posts
   - comments
   - announcements
   - events
   - education_contents
   - user_progress
   - who_growth_tables
   - audit_logs

## Step 2: Setup Environment Variables

### 2.1 Get Supabase Credentials
1. Di Supabase Dashboard, klik **Settings** (icon gear)
2. Klik **API**
3. Copy nilai berikut:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (secret!)

### 2.2 Update Environment Variables

#### Untuk Development (Local)
Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Untuk Production (Vercel)
1. Buka Vercel Dashboard
2. Pilih project **stuntcare**
3. Klik **Settings** → **Environment Variables**
4. Tambahkan 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://xxxxx.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_anon_key
   - `SUPABASE_SERVICE_ROLE_KEY` = your_service_role_key
5. Klik **Save**
6. **Redeploy** project

## Step 3: Setup Authentication

### 3.1 Enable Email Auth
1. Di Supabase Dashboard, klik **Authentication**
2. Klik **Providers**
3. Pastikan **Email** sudah enabled
4. Set **Confirm email** = OFF (untuk development)
   - Untuk production, set ON dan configure email templates

### 3.2 Enable Google OAuth (Optional)
1. Klik **Google** provider
2. Enable Google
3. Masukkan **Client ID** dan **Client Secret** dari Google Cloud Console
4. Set **Redirect URL** = `https://xxxxx.supabase.co/auth/v1/callback`

### 3.3 Configure Site URL
1. Klik **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://stuntcare-aivercel.app` (atau domain Anda)
3. Set **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://stuntcare-aivercel.app/auth/callback`

## Step 4: Test Registration

### 4.1 Test di Local
1. Jalankan `npm run dev`
2. Buka http://localhost:3000
3. Klik **Daftar**
4. Isi form registrasi
5. Klik **Daftar**
6. Jika berhasil, akan redirect ke onboarding

### 4.2 Cek Database
1. Buka Supabase Dashboard
2. Klik **Table Editor**
3. Klik table **profiles**
4. Pastikan ada data user baru

## Troubleshooting

### Error: "Could not find the table 'public.profiles'"
**Solusi:** Migrations belum dijalankan. Ulangi Step 1.

### Error: "Invalid API key"
**Solusi:** 
- Cek `.env.local` sudah benar
- Restart development server (`npm run dev`)

### Error: "Email not confirmed"
**Solusi:**
- Disable email confirmation di Supabase Auth settings
- Atau cek email untuk confirmation link

### Error: "Row Level Security policy violation"
**Solusi:**
- Pastikan migration 002 (RLS policies) sudah dijalankan
- Cek di SQL Editor: `SELECT * FROM profiles;` harus bisa diakses

### User bisa register tapi tidak bisa login
**Solusi:**
- Cek table profiles, pastikan user ada
- Cek role user sudah di-set
- Clear browser cache dan cookies

## Next Steps

Setelah setup selesai:
1. ✅ Test registrasi user (Kader & Ibu)
2. ✅ Test login
3. ✅ Test onboarding
4. ✅ Test create community (Kader)
5. ✅ Test join community (Ibu)
6. ✅ Test add child
7. ✅ Test add measurement

## Support

Jika masih ada masalah:
1. Cek Supabase logs: Dashboard → Logs
2. Cek browser console untuk error messages
3. Cek Network tab untuk failed API calls

---

**Last Updated:** January 9, 2026
