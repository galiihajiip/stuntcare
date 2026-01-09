# Deployment Guide - STUNTCARE

## Prerequisites

1. Supabase Project
2. Vercel Account
3. Node.js 18+ installed

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### 2. Run Migrations

```sql
-- Run in Supabase SQL Editor
-- 1. Run supabase/migrations/001_initial_schema.sql
-- 2. Run supabase/migrations/002_rls_policies.sql
```

### 3. Enable Realtime

1. Go to Database > Replication
2. Enable realtime for tables: `posts`, `visits`, `announcements`, `events`

### 4. Configure Auth

1. Go to Authentication > Providers
2. Enable Email provider
3. Enable Google OAuth (optional):
   - Add Google Client ID and Secret
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 2. Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Build Settings

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Domain Configuration

1. Add custom domain in Vercel Dashboard
2. Update DNS records as instructed
3. Enable HTTPS (automatic)

## Post-Deployment

### 1. Seed Education Content

Run this in Supabase SQL Editor:

```sql
INSERT INTO education_contents (category, title, content_md, reading_time, tags) VALUES
('gizi', 'Pentingnya Protein untuk Anak', 'Protein adalah nutrisi penting untuk pertumbuhan anak...', 5, ARRAY['protein', 'gizi', 'pertumbuhan']),
('sanitasi', 'Cuci Tangan yang Benar', 'Mencuci tangan dengan sabun dapat mencegah penyakit...', 3, ARRAY['sanitasi', 'kesehatan', 'pencegahan']),
('imunisasi', 'Jadwal Imunisasi Lengkap', 'Imunisasi melindungi anak dari penyakit berbahaya...', 7, ARRAY['imunisasi', 'vaksin', 'kesehatan']),
('pola_asuh', 'Stimulasi Tumbuh Kembang', 'Stimulasi sejak dini penting untuk perkembangan otak...', 6, ARRAY['pola_asuh', 'stimulasi', 'perkembangan']);
```

### 2. Create First Community

1. Register as kader
2. Create community via `/kader/community/create`
3. Share invite code with members

### 3. Test Features

- [ ] Authentication (email & Google)
- [ ] Community join via code
- [ ] Child registration
- [ ] Growth measurement input
- [ ] Z-score calculation
- [ ] Realtime updates
- [ ] Offline mode
- [ ] PWA installation

## Monitoring

### Performance

- Use Vercel Analytics
- Monitor Core Web Vitals
- Check Lighthouse scores

### Database

- Monitor Supabase Dashboard
- Check query performance
- Review RLS policies

### Errors

- Check Vercel Logs
- Monitor Supabase Logs
- Set up error tracking (Sentry recommended)

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups. For additional safety:

```bash
# Export data
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Code Backups

- Use Git for version control
- Tag releases: `git tag v1.0.0`
- Keep production branch protected

## Scaling Considerations

### Database

- Monitor connection pool usage
- Add indexes for slow queries
- Consider read replicas for high traffic

### Application

- Vercel auto-scales
- Use Edge Functions for global performance
- Implement caching strategies

## Security Checklist

- [ ] Environment variables secured
- [ ] RLS policies tested
- [ ] API routes protected
- [ ] Input validation implemented
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention
- [ ] XSS protection

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and optimize database queries
- Monitor error logs weekly
- Test backup restoration quarterly
- Review security policies monthly

### Updates

```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

## Support

For issues or questions:
- Check documentation
- Review GitHub issues
- Contact support team

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific version
vercel --prod --force
```

## Success Metrics

Track these KPIs:
- User registrations
- Active communities
- Children monitored
- Measurements recorded
- Education content completed
- App performance scores
