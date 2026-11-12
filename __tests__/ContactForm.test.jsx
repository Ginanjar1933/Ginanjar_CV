import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../src/hooks/useTheme';
import ContactForm from '../src/components/ContactForm';

const renderForm = () =>
  render(
    <ThemeProvider>
      <ContactForm />
    </ThemeProvider>
  );

const isiForm = async ({ nama, email, pesan }) => {
  await fireEvent.changeText(screen.getByPlaceholderText('Nama lengkap'), nama);
  await fireEvent.changeText(screen.getByPlaceholderText('nama@email.com'), email);
  await fireEvent.changeText(screen.getByPlaceholderText('Tulis pesan kamu'), pesan);
};

describe('ContactForm', () => {
  test('menampilkan error saat form kosong dikirim', async () => {
    await renderForm();
    await fireEvent.press(screen.getByText('Kirim Pesan'));

    expect(screen.getByText('Nama wajib diisi')).toBeOnTheScreen();
    expect(screen.getByText('Email wajib diisi')).toBeOnTheScreen();
    expect(screen.getByText('Pesan wajib diisi')).toBeOnTheScreen();
  });

  test('menolak format email yang salah', async () => {
    await renderForm();
    await isiForm({ nama: 'Gin', email: 'abc', pesan: 'Halo' });
    await fireEvent.press(screen.getByText('Kirim Pesan'));

    expect(screen.getByText('Format email tidak valid')).toBeOnTheScreen();
    expect(screen.queryByText(/berhasil dikirim/)).toBeNull();
  });

  test('menampilkan pesan sukses dan mengosongkan form saat valid', async () => {
    await renderForm();
    await isiForm({ nama: 'Gin', email: 'gin@example.com', pesan: 'Halo' });
    await fireEvent.press(screen.getByText('Kirim Pesan'));

    expect(screen.getByText('Pesan berhasil dikirim. Terima kasih!')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Nama lengkap').props.value).toBe('');
  });
});