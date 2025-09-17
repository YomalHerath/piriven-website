export const API_BASE =
  (process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Turn /media/... into http://127.0.0.1:8000/media/... */
export function mediaUrl(path?: string | null) {
  if (!path) return "";
  const base = API_BASE.replace(/\/api\/?$/, ""); // http://127.0.0.1:8000
  return path.startsWith("/media") ? `${base}${path}` : path;
}

function listify<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

async function getList<T = any>(path: string, params?: Record<string, any>) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status})`);
  const json = await res.json();
  return listify<T>(json);
}

export function fetchBooks(params?: Record<string, any>) {
  return getList("/books/", { page_size: 6, ...params });
}
export function fetchBookCategories(params?: Record<string, any>) {
  return getList("/book-categories/", params);
}

export async function fetchSlides() {
  return apiFetch("/slides/");
}

export async function fetchDownloadCategories() {
  return apiFetch("/download-categories/");
}

export async function fetchNews(params?: string) {
  const q = params ? `?${params}` : '';
  return apiFetch(`/news/${q}`);
}

export async function fetchNotices() {
  return apiFetch("/notices/");
}

export async function fetchEvents() {
  return apiFetch("/events/");
}

export async function fetchVideos() {
  return apiFetch("/videos/");
}

export async function fetchStats() {
  return apiFetch("/stats/");
}

export async function fetchLinks() {
  return apiFetch("/links/");
}

export async function sendContact(payload: {name: string; email: string; subject?: string; message: string;}) {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function fetchContactInfo() {
  return apiFetch('/contact-info/');
}

export async function fetchPublications(params?: Record<string, string>) {
  const url = new URL(`${API_BASE}/publications/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch publications");
  return res.json();
}

export async function fetchPublicationCategories() {
  const res = await fetch(`${API_BASE}/publication-categories/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch publication categories");
  return res.json();
}

export function fetchAlbums(params?: Record<string, any>) {
  // pulls albums with nested images when serializer includes them
  return getList("/albums/", { is_active: "true", ordering: "position", page_size: 50, ...params });
}

export async function fetchAlbumBySlug(slug: string) {
  const list = await fetchAlbums({ slug });         // backend supports slug filter
  return Array.isArray(list) && list.length ? list[0] : null;
}

export function fetchAlbumImages(albumId: number, params?: Record<string, any>) {
  // direct images endpoint (useful if you disable nested images in AlbumSerializer or want pagination)
  return getList("/gallery/", { album: albumId, page_size: 200, ...params });
}