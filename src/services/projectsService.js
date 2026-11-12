import projectsData from '../../data/projects.json';

// Ubah ke true untuk mendemokan tampilan error di video.
const SIMULASI_GAGAL = false;
const DELAY_MS = 700;

export function fetchProjects() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULASI_GAGAL) {
        reject(new Error('Gagal memuat portofolio. Periksa koneksi lalu coba lagi.'));
      } else {
        resolve(projectsData);
      }
    }, DELAY_MS);
  });
}