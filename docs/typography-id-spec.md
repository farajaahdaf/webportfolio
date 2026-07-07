# Spec: Perbaikan Pilihan Kalimat Bahasa Indonesia

## Assumptions
- Font, warna, layout, dan komponen visual tidak diubah.
- Perubahan hanya pada file copy/dictionary, tidak menyentuh file `.tsx` atau `.css`.
- SiteSettings di `data/settings.json` belum punya `translations.id`, jadi fallback dari `src/lib/i18n.ts` adalah sumber utama copy Indonesia.
- Konten data (proyek, post, experience) belum punya `translations.id`; tidak ditambahkan sekarang karena di luar cakupan.

## Objective
Merombak pilihan kata dan kalimat Bahasa Indonesia di `dictionary.id` dan `indonesianSettingsFallback` agar lebih rapi, natural, konsisten, dan profesional—tanpa mengubah struktur data, font, atau komponen UI.

Kriteria sukses:
- Copy Indonesia terasa alami (bukan terjemahan mentah dari bahasa Inggris).
- Panjang kalimat seimbang, tidak bertele-tele.
- Irama kalimat enak dibaca di heading, deskripsi, CTA, dan label.

## Tech Stack
- TypeScript (hanya file `src/lib/i18n.ts` yang disentuh).

## Commands
- Lint: `npm run lint`
- Type-check: `npm run type-check`
- Build: `npm run build`

## Code Style
Tidak ada perubahan kode selain string literal di `dictionary.id` dan `indonesianSettingsFallback`. Struktur objek tetap sama persis.

## Testing Strategy
- `npm run lint`
- `npm run type-check`
- `npm run build`

## Boundaries
- Always: jaga struktur objek dictionary tetap identik, jangan ubah key, jangan ubah file selain `src/lib/i18n.ts`.
- Ask first: menambah `translations.id` ke data JSON, mengubah komponen, menambah locale baru.
- Never: mengubah font, warna, layout, CSS, atau komponen `.tsx`.

## Success Criteria
- Semua string `dictionary.id` dan `indonesianSettingsFallback` menggunakan Bahasa Indonesia yang alami dan rapi.
- Tidak ada istilah Inggris yang tersisa di copy Indonesia kecuali istilah teknis (AI, ML, NLP, dll).
- `npm run lint`, `npm run type-check`, dan `npm run build` lulus.

## Open Questions
- Tidak ada. Cakupan sudah jelas: hanya perbaikan copy di `src/lib/i18n.ts`.
