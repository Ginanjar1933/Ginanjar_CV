import { validateContact } from '../src/utils/validateContact';

const valid = { nama: 'Ginanjar', email: 'gin@example.com', pesan: 'Halo' };

describe('validateContact', () => {
  test('form kosong menghasilkan tiga error', () => {
    const errors = validateContact({ nama: '', email: '', pesan: '' });
    expect(errors).toEqual({
      nama: 'Nama wajib diisi',
      email: 'Email wajib diisi',
      pesan: 'Pesan wajib diisi',
    });
  });

  test('isian hanya spasi dianggap kosong', () => {
    const errors = validateContact({ ...valid, nama: '   ' });
    expect(errors.nama).toBe('Nama wajib diisi');
  });

  test('format email salah ditolak', () => {
    const errors = validateContact({ ...valid, email: 'abc' });
    expect(errors.email).toBe('Format email tidak valid');
  });

  test('form valid tidak punya error', () => {
    expect(validateContact(valid)).toEqual({});
  });
});