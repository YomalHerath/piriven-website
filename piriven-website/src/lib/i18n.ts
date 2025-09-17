export type Lang = 'en' | 'si';

const cache: Record<string, string> = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('translationCache') || '{}')
  : {};

function saveCache() {
  try { localStorage.setItem('translationCache', JSON.stringify(cache)); } catch {}
}

export function detectLang(text: string): Lang {
  if (!text) return 'en';
  const hasSinhala = /[\u0D80-\u0DFF]/.test(text);
  return hasSinhala ? 'si' : 'en';
}

export async function translateText(text: string, target: Lang): Promise<string> {
  if (!text) return '';
  const key = `${target}|${text}`;
  if (cache[key]) return cache[key];
  const src = detectLang(text);
  if (src === target) {
    cache[key] = text; saveCache();
    return text;
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = (data?.[0] || []).map((seg: any) => seg[0]).join('');
    cache[key] = translated; saveCache();
    return translated || text;
  } catch {
    return text;
  }
}

export async function translateArray(arr: string[], target: Lang): Promise<string[]> {
  return Promise.all(arr.map((t) => translateText(t, target)));
}

