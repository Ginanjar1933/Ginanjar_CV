const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Menerima { nama, email, pesan }, mengembalikan objek error.
// Objek kosong berarti form valid.
export function validateContact(form) {
  const errors = {};

  if (!form.nama.trim()) errors.nama = 'Nama wajib diisi';

  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Format email tidak valid';
  }

  if (!form.pesan.trim()) errors.pesan = 'Pesan wajib diisi';

  return errors;
}