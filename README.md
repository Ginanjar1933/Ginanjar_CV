# Personal CV & Academic Score App

Aplikasi mobile CV pribadi + dashboard capaian akademik, dibuat dengan React Native dan Expo untuk UTS Pemrograman Mobile 2.

- **Nama:** Ginanjar Saepulloh
- **NIM:** 242505026
- **Mata kuliah:** Pemrograman Mobile 2 (Dosen: Iin, M.Kom)
- **Level yang diklaim:** Level 10 (Industry)

## Fitur

| Area | Fitur |
| --- | --- |
| Profil | Foto, nama, NIM, profesi, deskripsi, kartu lanyard |
| About | Timeline pendidikan dan pengalaman |
| Skills | Daftar keterampilan dinamis dari JSON |
| Portfolio | Kartu proyek, pencarian, filter tag, state loading/error/empty |
| My Score | Identitas akademik, current score, learning points, indikator progres (data dummy) |
| Contact | Form nama/email/pesan dengan validasi dan umpan balik |
| Tema | Mode gelap/terang, pilihan tersimpan di penyimpanan lokal |
| Navigasi | 6 tab dengan Expo Router dan dock kustom |

## Teknologi

Expo SDK 58, React Native 0.88, React 19, Expo Router, Reanimated, Gesture Handler, react-native-svg, AsyncStorage, Jest + React Native Testing Library.

## Cara menjalankan

Prasyarat: Node.js 22.13 atau lebih baru.

```bash
npm install
npx expo start
```

Lalu pindai QR dengan Expo Go (Android/iOS), atau tekan `a` (Android emulator), `i` (iOS simulator), `w` (web).

> Mode web hanya untuk preview. Tab Portfolio di web memakai tampilan "wall" yang berbeda dari versi mobile.

## Menjalankan tes

```bash
npm test
```

Cakupan tes: validasi form, filter portofolio, kelengkapan dan validitas data JSON (termasuk nilai My Score), render indikator progres dari data, theme toggle + penyimpanan preferensi, dan komponen state loading/error.

## Struktur proyek

```
src/
├── app/            # Halaman (Expo Router): _layout, (tabs)/index, about, skills, portfolio, my-score, contact
├── components/     # Komponen UI reusable (menerima data lewat props)
├── hooks/          # useTheme (tema + penyimpanan), useProjects (loading/error)
├── services/       # projectsService (mock API dengan jeda simulasi)
├── utils/          # Logika murni: validateContact, filterProjects
└── constants/      # Token desain (warna, spacing, tipografi)
data/               # Sumber data JSON (profile, skills, experience, projects, score)
assets/             # Gambar dan foto
__tests__/          # Tes Jest
jest.setup.js       # Mock modul native untuk pengujian
```

## Arsitektur dan aliran data

```
data/*.json ──► (services / hooks) ──► halaman di src/app ──► komponen via props
```

- **Data** tinggal di `data/*.json`; mengubah isi CV tidak menyentuh komponen.
- **Logika** (validasi, filter) ada di `src/utils` sebagai fungsi murni sehingga mudah dites.
- **Komponen** hanya menampilkan data yang diterima lewat props.
- **Portofolio** dimuat lewat `projectsService` (simulasi API) dan `useProjects`, sehingga loading dan error ditangani di satu tempat.

## Penanganan kondisi khusus

- **Loading:** spinner saat portofolio dimuat.
- **Error:** pesan + tombol "Coba lagi". Untuk mendemokan, ubah `SIMULASI_GAGAL` menjadi `true` di `src/services/projectsService.js`.
- **Empty:** pesan + tombol "Reset filter" saat pencarian tanpa hasil.
- **Form:** pesan error per field (termasuk format email) dan pesan sukses.

## Aksesibilitas

`accessibilityRole`, `accessibilityLabel`, dan `accessibilityState` dipakai pada tombol, filter, input, toggle tema, dan indikator progres. Area sentuh minimal 44 px. Pesan error dan sukses memakai role `alert`.

## Keputusan teknis

- Fungsi murni untuk logika supaya dapat dites tanpa merender UI.
- Satu hook `useProjects` agar kondisi loading/error tidak tersebar di komponen.
- AsyncStorage hanya untuk preferensi tema (data kecil dan non-sensitif).

## Keterbatasan

- Data My Score adalah data dummy (sesuai ketentuan UTS).
- Form kontak belum mengirim ke server.
- Portofolio memakai mock API lokal, belum API sungguhan.
- Integrasi API Academic War LMS belum dilakukan (pengembangan lanjutan).