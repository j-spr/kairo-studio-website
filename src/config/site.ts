/**
 * Configuración centralizada del sitio Kairo Studio
 * Lee variables de entorno y exporta constantes reutilizables
 */

// Datos de contacto (desde variables de entorno)
export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL || 'contacto@kairostudio.com.co';
export const PHONE_1 = import.meta.env.PUBLIC_PHONE_1 || '(313) 305 0878';
export const PHONE_2 = import.meta.env.PUBLIC_PHONE_2 || '(316) 871 1671';

// Redes sociales (desde variables de entorno)
export const SOCIAL_LINKS = {
  instagram: import.meta.env.PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/kairostudio.co/',
  facebook: import.meta.env.PUBLIC_FACEBOOK_URL || 'https://web.facebook.com/profile.php?id=61579079236011&sk=reels_tab',
  tiktok: import.meta.env.PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@kairostudio.co',
};

// Navegación del sitio
export const NAV_ITEMS = [
  { label: 'INICIO', href: '/' },
  { label: 'PROYECTOS', href: '#proyectos' },
  { label: 'PLANES', href: '#servicios' },
  { label: 'CONTACTO', href: '#contacto' },
] as const;

// Información general del sitio
export const SITE_INFO = {
  name: 'Kairo Studio',
  copyrightYear: new Date().getFullYear(),
} as const;
