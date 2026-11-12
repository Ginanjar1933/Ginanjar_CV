import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../src/hooks/useTheme';
import StateView from '../src/components/StateView';

describe('StateView', () => {
  test('state error menampilkan pesan dan tombol coba lagi', async () => {
    const onAction = jest.fn();
    await render(
      <ThemeProvider>
        <StateView
          type="error"
          message="Gagal memuat"
          actionLabel="Coba lagi"
          onAction={onAction}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Gagal memuat')).toBeOnTheScreen();
    await fireEvent.press(screen.getByText('Coba lagi'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  test('state loading menampilkan pesan tanpa tombol', async () => {
    await render(
      <ThemeProvider>
        <StateView type="loading" message="Memuat..." />
      </ThemeProvider>
    );

    expect(screen.getByText('Memuat...')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });
});