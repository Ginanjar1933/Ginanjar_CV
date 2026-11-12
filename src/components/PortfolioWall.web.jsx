import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { View, useWindowDimensions } from 'react-native';
import { Asset } from 'expo-asset';
import DriftWall from './DriftWall';
import './PortfolioWall.css';
import { useTheme } from '../hooks/useTheme';
import projectsData from '../../data/projects.json';

// Gambar buatan sendiri (id proyek sama dengan di projects.json).
// Path mengikuti letak file ini: src/components -> ../../assets
const LOCAL_IMAGES = Object.fromEntries(
  Object.entries({
    'sistem-penjadwalan': require('../../assets/Penjadwalan.png'),
    'video-story-editor': require('../../assets/Video.png'),
    onestore: require('../../assets/OneStore.png'),
    'cv-mobile': require('../../assets/Personal CV.png'),
    'registrasi-wajah': require('../../assets/Registrasi.png'),
    'kalkulator-web': require('../../assets/Kalkulator.png'),
    'latihan-javascript': require('../../assets/JavaScript.png'),
  }).map(([id, mod]) => [id, Asset.fromModule(mod).uri])
);

// Kata kunci foto ilustrasi per proyek (dipakai oleh loremflickr.com).
const KATA_KUNCI = {
  'sistem-penjadwalan': 'calendar,planner',
  'video-story-editor': 'film,camera',
  onestore: 'shopping,store',
  'cv-mobile': 'smartphone,app',
  'registrasi-wajah': 'technology,security',
  'kalkulator-web': 'calculator,math',
  'latihan-javascript': 'code,programming',
};

// Urutan sumber gambar. Yang pertama berhasil dimuat akan dipakai.
// 1) gambar lokal buatan sendiri (LOCAL_IMAGES)
// 2) field "gambar" di projects.json (mis. screenshot asli)
// 3) loremflickr.com (sesuai kata kunci)
// 4) picsum.photos (cadangan, stabil per proyek)
function sourcesOf(p, index) {
  const list = [];
  if (LOCAL_IMAGES[p.id]) list.push(LOCAL_IMAGES[p.id]);
  if (p.gambar) list.push(p.gambar);
  const kw = KATA_KUNCI[p.id];
  if (kw) list.push(`https://loremflickr.com/600/400/${kw}?lock=${index + 11}`);
  list.push(`https://picsum.photos/seed/${encodeURIComponent(p.id)}/600/400`);
  return list;
}

function loadOne(url, ms = 10000) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(ok);
    };
    const img = new Image();
    const timer = setTimeout(() => finish(false), ms);
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = url;
  });
}

async function firstWorking(urls) {
  for (const url of urls) {
    if (await loadOne(url)) return url;
  }
  return null;
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Sampul SVG cadangan bila semua sumber foto gagal dimuat.
function makeCover(p) {
  const warna = p.warna || '#38BDF8';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${warna}"/><stop offset="1" stop-color="#0F172A"/></linearGradient></defs>
<rect width="600" height="400" fill="url(#g)"/>
<circle cx="520" cy="70" r="150" fill="#fff" fill-opacity="0.08"/>
<circle cx="60" cy="380" r="190" fill="#fff" fill-opacity="0.06"/>
<text x="40" y="70" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="#fff" fill-opacity="0.8" letter-spacing="3">${esc(
    (p.kategori || '').toUpperCase()
  )}</text>
<text x="40" y="330" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="800" fill="#fff">${esc(
    p.singkat || p.judul
  )}</text>
<text x="40" y="368" font-family="Arial,Helvetica,sans-serif" font-size="22" fill="#fff" fill-opacity="0.85">${esc(
    p.tahun
  )}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ProjectModal({ project, photo, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Catatan "ilustrasi acak" hanya muncul bila gambar berasal dari layanan acak,
  // bukan dari gambar lokal buatan sendiri atau screenshot asli.
  const isIllustration =
    photo && !project.gambar && photo !== LOCAL_IMAGES[project.id];

  const modal = (
    <div className="pw-backdrop" onClick={onClose}>
      <div
        className="pw-card"
        role="dialog"
        aria-modal="true"
        aria-label={project.judul}
        onClick={(e) => e.stopPropagation()}
      >
        <img className="pw-card__img" src={photo || makeCover(project)} alt="" />
        <div className="pw-card__shade" />
        <button
          ref={closeRef}
          type="button"
          className="pw-card__close"
          onClick={onClose}
          aria-label="Tutup detail proyek"
        >
          ×
        </button>

        <div className="pw-card__scroll">
          <div className="pw-card__meta">
            {project.kategori} · {project.tahun}
          </div>
          <h2 className="pw-card__title">{project.judul}</h2>
          <p className="pw-card__desc">{project.deskripsi}</p>

          <h3 className="pw-card__h">Fitur utama</h3>
          <ul className="pw-card__list">
            {project.fitur.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <h3 className="pw-card__h">Teknologi</h3>
          <div className="pw-card__chips">
            {project.teknologi.map((t) => (
              <span key={t} className="pw-chip">
                {t}
              </span>
            ))}
          </div>

          {project.catatan ? (
            <p className="pw-card__note">Catatan: {project.catatan}</p>
          ) : null}

          <div className="pw-card__actions">
            {project.repos.map((r) => (
              <a
                key={r.url}
                className="pw-btn"
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {r.nama}
              </a>
            ))}
            {project.demo ? (
              <a
                className="pw-btn pw-btn--primary"
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
              >
                Lihat demo
              </a>
            ) : null}
          </div>

          {isIllustration ? (
            <p style={{ margin: '14px 0 0', fontSize: 11, opacity: 0.6 }}>
              Gambar latar hanyalah ilustrasi dari layanan gambar acak, bukan
              tangkapan layar proyek.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  // Portal ke body supaya tidak terpotong transform/overflow induknya.
  return createPortal(modal, document.body);
}

export default function PortfolioWall({ embedded = false }) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [boxW, setBoxW] = useState(windowWidth);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState({}); // id -> url foto yang berhasil dimuat

  // Muat foto satu per satu; langsung tampil begitu siap.
  useEffect(() => {
    let cancelled = false;
    projectsData.forEach((p, i) => {
      firstWorking(sourcesOf(p, i)).then((url) => {
        if (cancelled || !url) return;
        setPhotos((prev) => ({ ...prev, [p.id]: url }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onLayout = useCallback(
    (e) => setBoxW(Math.round(e.nativeEvent.layout.width)),
    []
  );

  const compact = boxW < 600;
  const small = compact || embedded;
  const tileWidth = compact ? 150 : embedded ? 190 : 210;
  const tileHeight = Math.round(tileWidth * 0.66);
  const gap = small ? 12 : 18;

  // Jumlah kolom mengikuti lebar kotak, supaya layar lebar terisi penuh.
  const columns = Math.min(
    11,
    Math.max(3, Math.ceil(boxW / ((tileWidth + gap) * 1.05)) + 1)
  );

  // Ulang daftar proyek dengan urutan berbeda per kolom agar tidak sama semua.
  const items = useMemo(() => {
    const total = projectsData.length;
    const rows = 3;
    return Array.from({ length: columns * rows }, (_, i) => {
      const c = i % columns;
      const r = Math.floor(i / columns);
      const p = projectsData[(c * 2 + r * 3) % total];
      const photo = photos[p.id];
      return photo
        ? { id: p.id, title: p.judul, image: photo, label: p.singkat || p.judul }
        : { id: p.id, title: p.judul, image: makeCover(p) };
    });
  }, [photos, columns]);

  const byId = useMemo(
    () => Object.fromEntries(projectsData.map((p) => [p.id, p])),
    []
  );

  const handleClick = useCallback(
    (item) => setSelected(byId[item.id] ?? null),
    [byId]
  );
  const close = useCallback(() => setSelected(null), []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <DriftWall
          items={items}
          columns={columns}
          tileWidth={tileWidth}
          tileHeight={tileHeight}
          gap={gap}
          tilt={small ? 10 : 16}
          turn={small ? -8 : -14}
          depth={small ? 60 : 120}
          speed={36}
          parallax={small ? 0 : 0.6}
          lift={small ? 30 : 64}
          fade={0.25}
          dim={0.95}
          overlayColor="transparent"
          onItemClick={handleClick}
        />
      </div>

      <div
        className={`pw-hint${embedded ? ' pw-hint--embedded' : ''}`}
        style={{ color: colors.text }}
      >
        Klik salah satu proyek untuk melihat detailnya
      </div>

      {selected ? (
        <ProjectModal
          project={selected}
          photo={photos[selected.id]}
          onClose={close}
        />
      ) : null}
    </View>
  );
}