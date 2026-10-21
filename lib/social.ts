import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter, FaYoutube, FaWhatsapp, FaTiktok, FaTelegram, FaDribbble, FaBehance, FaMedium, FaFacebook, FaDiscord } from "react-icons/fa6";
// Warna resmi tiap platform; ikon putih di dalam lingkaran berwarna.
export const social: Record<string, { Icon: any; bg: string }> = {
  github: { Icon: FaGithub, bg: "#24292f" }, linkedin: { Icon: FaLinkedin, bg: "#0a66c2" },
  instagram: { Icon: FaInstagram, bg: "linear-gradient(45deg,#f58529,#dd2a7b 55%,#8134af)" },
  x: { Icon: FaXTwitter, bg: "#000" }, twitter: { Icon: FaXTwitter, bg: "#000" }, youtube: { Icon: FaYoutube, bg: "#ff0000" },
  whatsapp: { Icon: FaWhatsapp, bg: "#25d366" }, tiktok: { Icon: FaTiktok, bg: "#010101" }, telegram: { Icon: FaTelegram, bg: "#26a5e4" },
  dribbble: { Icon: FaDribbble, bg: "#ea4c89" }, behance: { Icon: FaBehance, bg: "#1769ff" }, medium: { Icon: FaMedium, bg: "#000" },
  facebook: { Icon: FaFacebook, bg: "#1877f2" }, discord: { Icon: FaDiscord, bg: "#5865f2" } };
