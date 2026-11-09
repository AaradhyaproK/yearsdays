import en from './en.json';
import es from './es.json';
import pt from './pt.json';
import de from './de.json';
import fr from './fr.json';
import it from './it.json';
import tr from './tr.json';

export type SupportedLocale = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'it' | 'tr';

export const LOCALES: Record<SupportedLocale, { name: string; nativeName: string; bcp47: string; dir: 'ltr' }> = {
  en: { name: 'English', nativeName: 'English', bcp47: 'en', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', bcp47: 'es', dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', bcp47: 'pt-BR', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', bcp47: 'de', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', bcp47: 'fr', dir: 'ltr' },
  it: { name: 'Italian', nativeName: 'Italiano', bcp47: 'it', dir: 'ltr' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', bcp47: 'tr', dir: 'ltr' },
};

const translations: Record<SupportedLocale, typeof en> = {
  en,
  es,
  pt,
  de,
  fr,
  it,
  tr,
};

export function getTranslations(lang: string): typeof en {
  const code = (lang in translations ? lang : 'en') as SupportedLocale;
  return translations[code];
}

export const SLUG_MAP: Record<string, Partial<Record<SupportedLocale, string>>> = {
  'days-alive': {
    en: 'days-alive',
    es: 'dias-de-vida',
    pt: 'dias-de-vida',
  },
  'dias-de-vida': {
    en: 'days-alive',
    es: 'dias-de-vida',
    pt: 'dias-de-vida',
  },
  'age-on-a-date': {
    en: 'age-on-a-date',
    es: 'edad-en-una-fecha',
    pt: 'idade-em-uma-data',
  },
  'edad-en-una-fecha': {
    en: 'age-on-a-date',
    es: 'edad-en-una-fecha',
    pt: 'idade-em-uma-data',
  },
  'idade-em-uma-data': {
    en: 'age-on-a-date',
    es: 'edad-en-una-fecha',
    pt: 'idade-em-uma-data',
  },
};

/**
 * Returns canonical localized URL path with trailing slash.
 */
export function getLocalizedPath(path: string, lang: SupportedLocale): string {
  const cleanPath = path.replace(/^\/([a-z]{2}\/)?/, '').replace(/^\//, '').replace(/\/$/, '');
  
  // Check if cleanPath matches a known tool slug in SLUG_MAP
  const slugKey = Object.keys(SLUG_MAP).find((k) => cleanPath === k || cleanPath === `tools/${k}`);
  let localizedSlug = cleanPath;
  if (slugKey && SLUG_MAP[slugKey]?.[lang]) {
    localizedSlug = SLUG_MAP[slugKey]![lang]!;
  }

  const prefix = lang === 'en' ? '' : `/${lang}`;
  const slug = localizedSlug ? `/${localizedSlug}` : '';
  return `${prefix}${slug}/`;
}

/**
 * Formats integer with locale-appropriate thousand separators.
 * Safe against NaN, null, and undefined values.
 */
export function formatNumber(num: number | undefined | null, lang: string): string {
  if (num === undefined || num === null || Number.isNaN(num)) {
    return '0';
  }
  const bcp47 = LOCALES[lang as SupportedLocale]?.bcp47 || 'en';
  return new Intl.NumberFormat(bcp47).format(num);
}

