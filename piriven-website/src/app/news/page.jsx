'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNews, mediaUrl } from '@/lib/api';
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

function formatTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (err) {
    return '';
  }
}

export default function NewsPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchNews();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load news');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const news = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const excerpt = preferLanguage(item?.excerpt, item?.excerpt_si, lang) || '';
    const publishedAt = item?.published_at || '';
    const image = mediaUrl(item?.image);
    const slug = item?.slug || (item?.id ? String(item.id) : '');
    const href = slug ? `/news/${slug}` : '#';
    return {
      id: item?.id ?? item?.slug ?? title,
      slug,
      href,
      title,
      excerpt,
      date: formatDate(publishedAt),
      time: formatTime(publishedAt),
      image,
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
            <T>All News</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600"><T>Loading news…</T></p>
          ) : null}
        </section>

        {!loading && !news.length ? (
          <div className="text-center text-neutral-600">
            <T>No news articles yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-56 bg-neutral-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {item.date}
                  {item.time ? <span className="ml-2 text-neutral-400">{item.time}</span> : null}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
                {item.excerpt ? (
                  <p className="mt-3 text-sm text-neutral-600 line-clamp-3">{item.excerpt}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600">
                    <T>Read full story</T>
                  </span>
                </div>
              </div>
            </Link>
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
