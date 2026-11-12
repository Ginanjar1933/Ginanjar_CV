import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider, THEME_STORAGE_KEY } from '../src/hooks/useTheme';
import ThemeToggle from '../src/components/ThemeToggle';

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('ThemeToggle', () => {
  test('mulai dari mode gelap, lalu pindah ke terang dan menyimpan pilihan', async () => {
    await renderToggle();
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();

    await fireEvent.press(toggle);

    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'light');
  });

  test('memakai preferensi tema yang tersimpan', async () => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, 'light');
    await renderToggle();

    await waitFor(() => {
      expect(screen.getByRole('switch')).not.toBeChecked();
    });
  });
});