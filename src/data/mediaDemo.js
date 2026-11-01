// Replace these demonstration URLs and metadata with authorized CDN records.
export const students = [
  { id: "mehdi", name: "Mehdi B.", category: "ADULTE", consent: true },
  { id: "sarah", name: "Sarah L.", category: "ADULTE", consent: true },
  { id: "enzo", name: "Enzo M.", category: "ADOS", consent: true },
  { id: "lea", name: "Léa D.", category: "KIDS", consent: false },
  { id: "lucas", name: "Lucas R.", category: "BABY", consent: true },
  { id: "thomas", name: "Thomas V.", category: "ADULTE", consent: false },
];
export const initialFiles = [
  {
    id: "v1",
    name: "sparring_bastille_rd1.mp4",
    size: 42 * 1024 ** 2,
    type: "video",
    progress: 0.72,
  },
  {
    id: "v2",
    name: "drill_guard_pass.mp4",
    size: 68 * 1024 ** 2,
    type: "video",
    progress: 0.46,
  },
  {
    id: "p1",
    name: "photo_podium_groupe.jpg",
    size: 14 * 1024 ** 2,
    type: "image",
    progress: 1,
  },
];
export const demoAlbum = Array.from({ length: 20 }, (_, i) => ({
  id: `photo-${i}`,
  type: "image",
  title: `CDL BOUT #${11 + i}`,
  uri: `https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&q=85&sig=${i}`,
  caption: "24 Octobre 2024 • Par Coach Mehdi • Léo & Inès",
}));
export const demoVideos = [1, 2].map((i) => ({
  id: `video-${i}`,
  type: "video",
  title: "SPARRING CLIP 04/12",
  uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
}));
