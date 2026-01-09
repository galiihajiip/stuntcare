# Contributing to STUNTCARE

Terima kasih atas minat Anda untuk berkontribusi pada STUNTCARE! Dokumen ini berisi panduan untuk berkontribusi pada proyek ini.

## Code of Conduct

Dengan berpartisipasi dalam proyek ini, Anda diharapkan untuk menjaga lingkungan yang ramah dan profesional.

## Cara Berkontribusi

### Melaporkan Bug

1. Pastikan bug belum dilaporkan dengan mencari di Issues
2. Buat issue baru dengan label "bug"
3. Sertakan:
   - Deskripsi jelas tentang masalah
   - Langkah-langkah untuk mereproduksi
   - Hasil yang diharapkan vs aktual
   - Screenshot jika relevan
   - Environment (browser, OS, dll)

### Mengusulkan Fitur Baru

1. Buat issue dengan label "enhancement"
2. Jelaskan:
   - Masalah yang ingin diselesaikan
   - Solusi yang diusulkan
   - Alternatif yang sudah dipertimbangkan
   - Mockup atau wireframe jika ada

### Pull Request Process

1. Fork repository
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'Add: deskripsi fitur'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

#### Commit Message Convention

```
Type: Short description

Longer description if needed

Type dapat berupa:
- Add: Menambah fitur baru
- Fix: Memperbaiki bug
- Update: Memperbarui fitur existing
- Remove: Menghapus fitur
- Refactor: Refactoring code
- Docs: Perubahan dokumentasi
- Test: Menambah atau update test
- Style: Perubahan formatting
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/stuntcare.git
cd stuntcare

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan kredensial Anda

# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

### Coding Standards

#### TypeScript

- Gunakan TypeScript untuk semua file baru
- Hindari `any`, gunakan type yang spesifik
- Export interface dan type yang reusable

#### React Components

- Gunakan functional components dengan hooks
- Pisahkan logic dan presentation
- Buat components yang reusable
- Gunakan proper prop types

#### Styling

- Gunakan Tailwind CSS classes
- Ikuti design system yang ada
- Responsive design (mobile-first)
- Dark mode support

#### File Structure

```
app/
  [feature]/
    page.tsx          # Main page
    layout.tsx        # Layout jika perlu
    [id]/
      page.tsx        # Dynamic route
components/
  ui/                 # Reusable UI components
  [feature]/          # Feature-specific components
lib/
  [feature]/          # Business logic
    utils.ts
    types.ts
```

### Testing

- Tulis unit tests untuk business logic
- Tulis E2E tests untuk critical user flows
- Pastikan semua tests pass sebelum PR
- Aim for >80% code coverage

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

### Documentation

- Update README.md jika menambah fitur besar
- Tambahkan JSDoc comments untuk functions
- Update DEPLOYMENT.md jika ada perubahan deployment
- Dokumentasikan breaking changes

### Accessibility

- Gunakan semantic HTML
- Tambahkan ARIA labels yang sesuai
- Pastikan keyboard navigation works
- Test dengan screen reader
- Maintain color contrast ratios

### Performance

- Optimize images (use Next.js Image)
- Lazy load components when appropriate
- Minimize bundle size
- Use React.memo untuk expensive components
- Implement proper caching strategies

### Security

- Validate all user inputs
- Sanitize data before display
- Use parameterized queries
- Follow OWASP guidelines
- Never commit secrets

## Review Process

1. Automated checks harus pass (tests, linting)
2. Code review oleh maintainer
3. Perubahan yang diminta harus diselesaikan
4. Approval dari minimal 1 maintainer
5. Merge ke main branch

## Release Process

1. Update version di package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy ke production
5. Announce di community

## Questions?

Jika ada pertanyaan, silakan:
- Buka issue dengan label "question"
- Hubungi maintainer
- Join Discord/Slack community

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License.

## Acknowledgments

Terima kasih kepada semua kontributor yang telah membantu mengembangkan STUNTCARE!
