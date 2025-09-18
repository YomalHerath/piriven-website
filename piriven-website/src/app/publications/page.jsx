'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchBooks, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (err) {
    return value;
  }
}

export default function PublicationsPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchBooks({ page_size: 100, ordering: '-published_at' });
        if (!ignore) setItems(Array.isArray(data) ? data : (data?.results || []));
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load publications');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const publications = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const subtitle = preferLanguage(item?.subtitle, item?.subtitle_si, lang) || '';
    const authors = preferLanguage(item?.authors, item?.authors_si, lang) || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const year = item?.year ? String(item.year) : '';
    const cover = mediaUrl(item?.cover);
    const pdf = mediaUrl(item?.pdf_file);
    const externalUrl = item?.external_url || '';
    const href = externalUrl || pdf || '';
    const isExternal = Boolean(externalUrl);
    return {
      id: item?.id ?? title,
      title,
      subtitle,
      authors,
      description,
      year,
      cover,
      href,
      isExternal,
      publishedAt: formatDate(item?.published_at),
    };
  }), [items, lang]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            <T>All Publications</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600"><T>Loading publications…</T></p>
          ) : null}
        </section>

        {!loading && !publications.length ? (
          <div className="text-center text-neutral-600">
            <T>No publications yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {publications.map((book) => (
            <article
              key={book.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-64 bg-neutral-200">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {book.publishedAt || book.year || <T>Undated</T>}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-gray-900 leading-snug">
                  {book.title}
                </h2>
                {book.subtitle ? (
                  <p className="mt-2 text-sm text-neutral-500">{book.subtitle}</p>
                ) : null}
                {book.authors ? (
                  <p className="mt-1 text-sm text-neutral-500">
                    <T>Authors</T>: {book.authors}
                  </p>
                ) : null}
                {book.description ? (
                  <p className="mt-4 text-sm text-neutral-600 line-clamp-4">{book.description}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  {book.href ? (
                    <a
                      href={book.href}
                      target={book.isExternal ? '_blank' : '_self'}
                      rel={book.isExternal ? 'noreferrer' : undefined}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <T>View publication</T>
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-sm font-semibold text-neutral-400">
                      <T>No file available</T>
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center pt-12">
          <Link href="/">
            <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
              ← <T>Back to Home</T>
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
