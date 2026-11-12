import score from '../data/score.json';
import profile from '../data/profile.json';
import projects from '../data/projects.json';
import skills from '../data/skills.json';
import experience from '../data/experience.json';

describe('score.json', () => {
  test('memuat semua nilai wajib dari soal UTS', () => {
    expect(score.currentScore).toEqual({ nilai: 89, grade: 'A' });
    expect(score.learningPoints.total).toBe(12375);

    const persen = Object.fromEntries(score.progress.map((p) => [p.id, p.persen]));
    expect(persen).toEqual({
      attendance: 100,
      practice: 87,
      quest: 95,
      challenge: 100,
    });
  });

  test('semua persentase berada di rentang 0-100', () => {
    score.progress.forEach((p) => {
      expect(p.persen).toBeGreaterThanOrEqual(0);
      expect(p.persen).toBeLessThanOrEqual(100);
    });
  });
});

describe('data lain', () => {
  test('profile.json punya identitas lengkap', () => {
    ['nama', 'nim', 'profesi', 'deskripsi'].forEach((k) => {
      expect(profile[k]).toBeTruthy();
    });
  });

  test('id proyek unik dan setiap proyek punya tag', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    projects.forEach((p) => expect(p.tags.length).toBeGreaterThan(0));
  });

  test('skills dan experience tidak kosong', () => {
    expect(skills.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
  });
});