export const SEMUA = 'Semua';

export function getAllTags(projects) {
  return [SEMUA, ...new Set(projects.flatMap((p) => p.tags))];
}

export function filterProjects(projects, query = '', activeTag = SEMUA) {
  const keyword = query.trim().toLowerCase();

  return projects.filter((p) => {
    const cocokTag = activeTag === SEMUA || p.tags.includes(activeTag);
    const cocokKata =
      keyword === '' ||
      p.judul.toLowerCase().includes(keyword) ||
      p.deskripsi.toLowerCase().includes(keyword);
    return cocokTag && cocokKata;
  });
}