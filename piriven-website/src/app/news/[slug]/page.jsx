'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNewsDetail, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

function ensureString(value) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function formatDateTime(value) {
  if (!value) return { date: '', time: '' };
  try {
    const date = new Date(value);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (error) {
    return { date: value, time: '' };
  }
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const effectiveSlug = ensureString(slug);
  const { lang } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!effectiveSlug) {
      setLoading(false);
      setErr('News not found');
      return;
    }

    let ignore = false;
    setLoading(true);
    setErr('');

    (async () => {
      try {
        const item = await fetchNewsDetail(effectiveSlug);
        if (!ignore) setData(item);
      } catch (error) {
        if (!ignore) setErr(error?.message || 'Failed to load news');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [effectiveSlug]);

  const news = useMemo(() => {
    if (!data) return null;
    const title = preferLanguage(data?.title, data?.title_si, lang) || data?.title || '';
    const content = preferLanguage(data?.content, data?.content_si, lang) || data?.content || '';
    const excerpt = preferLanguage(data?.excerpt, data?.excerpt_si, lang) || '';
    const image = mediaUrl(data?.image);
    const { date, time } = formatDateTime(data?.published_at);
    return {
      title,
      content,
      excerpt,
      image,
      date,
      time,
    };
  }, [data, lang]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            ← <span className="ml-2"><T>Back to all news</T></span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-neutral-600">
            <T>Loading news…</T>
          </div>
        ) : null}

        {err ? (
          <div className="text-center text-sm text-red-600">
            Error: {err}
          </div>
        ) : null}

        {!loading && !err && news ? (
          <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {news.image ? (
              <div className="relative h-72 w-full bg-neutral-200">
                <img
                  src={news.image}
                  alt={news.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {news.date}
                {news.time ? <span className="ml-2 text-neutral-400">{news.time}</span> : null}
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {news.title || <T>Untitled</T>}
              </h1>
              {news.excerpt ? (
                <p className="mt-4 text-base text-neutral-600">{news.excerpt}</p>
              ) : null}
              {news.content ? (
                <div
                  className="mt-8 prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              ) : (
                <p className="mt-8 text-sm text-neutral-500">
                  <T>Full content coming soon.</T>
                </p>
              )}
            </div>
          </article>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
