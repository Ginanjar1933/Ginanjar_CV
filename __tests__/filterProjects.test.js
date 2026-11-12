import { SEMUA, filterProjects, getAllTags } from '../src/utils/filterProjects';

const sample = [
  { id: 'a', judul: 'Toko Online', deskripsi: 'Front-end web', tags: ['Web', 'JavaScript'] },
  { id: 'b', judul: 'Aplikasi CV', deskripsi: 'Mobile Expo', tags: ['Mobile', 'React Native'] },
  { id: 'c', judul: 'Penjadwalan', deskripsi: 'Laravel fullstack', tags: ['Web', 'Laravel'] },
];

describe('filterProjects', () => {
  test('tanpa filter mengembalikan semua proyek', () => {
    expect(filterProjects(sample)).toHaveLength(3);
  });

  test('filter berdasarkan tag', () => {
    const hasil = filterProjects(sample, '', 'Web');
    expect(hasil.map((p) => p.id)).toEqual(['a', 'c']);
  });

  test('pencarian tidak peka huruf besar/kecil, cek judul dan deskripsi', () => {
    expect(filterProjects(sample, 'APLIKASI').map((p) => p.id)).toEqual(['b']);
    expect(filterProjects(sample, 'laravel').map((p) => p.id)).toEqual(['c']);
  });

  test('tag dan kata kunci digabung', () => {
    expect(filterProjects(sample, 'toko', 'Web').map((p) => p.id)).toEqual(['a']);
    expect(filterProjects(sample, 'toko', 'Mobile')).toEqual([]);
  });

  test('tidak ada yang cocok menghasilkan array kosong', () => {
    expect(filterProjects(sample, 'zzz')).toEqual([]);
  });
});

describe('getAllTags', () => {
  test('diawali "Semua" dan tidak ada duplikat', () => {
    const tags = getAllTags(sample);
    expect(tags[0]).toBe(SEMUA);
    expect(tags).toEqual(['Semua', 'Web', 'JavaScript', 'Mobile', 'React Native', 'Laravel']);
  });
});