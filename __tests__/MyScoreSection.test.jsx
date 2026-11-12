import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../src/hooks/useTheme';
import MyScoreSection from '../src/components/MyScoreSection';
import scoreData from '../data/score.json';

describe('MyScoreSection', () => {
  beforeEach(async () => {
    await render(
      <ThemeProvider>
        <MyScoreSection data={scoreData} />
      </ThemeProvider>
    );
  });

  test('menampilkan identitas akademik', () => {
    expect(screen.getByText('Ginanjar Saepulloh')).toBeOnTheScreen();
    expect(screen.getByText('242505026')).toBeOnTheScreen();
    expect(screen.getByText('Pemrograman Mobile 2')).toBeOnTheScreen();
    expect(screen.getByText('Iin, M.Kom')).toBeOnTheScreen();
  });

  test('menampilkan current score dan learning points', () => {
    expect(screen.getByText('89')).toBeOnTheScreen();
    expect(screen.getByText('Grade A')).toBeOnTheScreen();
    expect(screen.getByText(/12[.,]375/)).toBeOnTheScreen();
  });

  test('merender indikator progres dari data JSON', () => {
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(scoreData.progress.length);

    bars.forEach((bar, i) => {
      expect(bar.props.accessibilityValue.now).toBe(scoreData.progress[i].persen);
    });

    expect(screen.getAllByText('100%')).toHaveLength(2); // Attendance & Challenge
    expect(screen.getByText('87%')).toBeOnTheScreen();
    expect(screen.getByText('95%')).toBeOnTheScreen();
  });
});