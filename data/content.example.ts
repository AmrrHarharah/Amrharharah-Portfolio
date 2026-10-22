// CONTOH struktur data. Salin ke data/content.ts (atau cocokkan dengan file Anda) lalu isi dengan data asli.
export const me = {
  name: "Nama Anda",
  role: "Full-stack Developer",
  email: "halo@email.com",
  city: "Jakarta, Indonesia",
  words: ["Halo", "Hello", "こんにちは", "Bonjour", "Hola", "Selamat datang"],
  intro: "Saya membangun produk web yang cepat, rapi, dan nyaman dipakai.",
  about:
    "Ceritakan siapa Anda, fokus Anda, dan cara Anda bekerja dalam beberapa kalimat.",
  // Opsional:
  tagline: "Membangun web yang cepat dan nyaman dipakai.",
  siteUrl: "https://namaanda.com",
  photo: "/foto.jpg",
  cv: "/cv.pdf",
  awayTitle: "Kembali ya 👋",
  socials: [
    { label: "GitHub", href: "https://github.com/username" },
    { label: "LinkedIn", href: "https://linkedin.com/in/username" },
    { label: "Instagram", href: "https://instagram.com/username" },
  ],
  testimonials: [
    {
      quote: "Kerjanya rapi dan tepat waktu.",
      name: "Nama Orang",
      role: "Jabatan, Perusahaan",
    },
  ],
  stats: [
    { value: 3, suffix: "+", label: "Tahun pengalaman" },
    { value: 12, suffix: "", label: "Proyek selesai" },
    { value: 8, suffix: "", label: "Klien puas" },
  ],
};
export const projects = [
  {
    title: "Nama Proyek",
    type: "E-commerce",
    year: "2026",
    stack: "Next.js, Prisma",
    href: "#",
    image: "/projects/nama.jpg",
    link: "https://web-app-anda.com",
    github: "https://github.com/username/repo",
    summary: "Ringkasan proyek.",
    problem: "Masalah yang diselesaikan.",
    role: "Peran Anda.",
    result: "Hasil, sebaiknya dengan angka.",
  },
];
export const skills = [
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "Prisma", "Redis"] },
  { group: "Tools", items: ["Git", "Docker", "Vercel", "Figma", "GitHub"] },
];
export const jobs = [
  {
    period: "2024 – sekarang",
    role: "Jabatan",
    org: "Perusahaan",
    note: "Pencapaian utama Anda.",
  },
];
