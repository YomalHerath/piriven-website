'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNotice, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

function ensureString(value) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return value;
  }
}

export default function NoticeDetailPage() {
  const params = useParams();
  const rawId = ensureString(params?.id);
  const noticeId = rawId || '';
  const { lang } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!noticeId) {
      setLoading(false);
      setErr('Notice not found');
      return;
    }

    let ignore = false;
    setLoading(true);
    setErr('');

    (async () => {
      try {
        const item = await fetchNotice(noticeId);
        if (!ignore) setData(item);
      } catch (error) {
        if (!ignore) setErr(error?.message || 'Failed to load notice');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [noticeId]);

  const notice = useMemo(() => {
    if (!data) return null;
    const title = preferLanguage(data?.title, data?.title_si, lang) || data?.title || '';
    const content = preferLanguage(data?.content, data?.content_si, lang) || data?.content || '';
    const image = mediaUrl(data?.image);
    return {
      title,
      content,
      image,
      publishedAt: formatDate(data?.published_at),
      expiresAt: formatDate(data?.expires_at),
    };
  }, [data, lang]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 max-w-7xl">
        {loading ? (
          <div className="text-center text-neutral-600 font-light mt-16">
            <T>Loading notice…</T>
          </div>
        ) : null}

        {err ? (
          <div className="text-center text-sm text-red-800 font-light mt-16">
            Error: {err}
          </div>
        ) : null}

        {!loading && !err && notice ? (
          <article className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Image */}
            {notice.image && (
              <div className="md:col-span-1 mt-8 md:mt-0">
                <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl bg-neutral-200">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            
            {/* Right Column: Text Content */}
            <div className="md:col-span-1">
              <div className="mb-8">
                <Link
                  href="/notices"
                  className="inline-flex items-center text-sm font-light text-black hover:text-red-800 transition-colors"
                >
                  ← <span className="ml-2"><T>Back to all notices</T></span>
                </Link>
              </div>

              <p className="text-xs font-light uppercase tracking-wide text-neutral-500">
                {notice.publishedAt || <T>Undated</T>}
                {notice.expiresAt ? (
                  <span className="ml-2 text-neutral-400">
                    <T>Expires</T>: {notice.expiresAt}
                  </span>
                ) : null}
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-light text-gray-900 leading-tight">
                {notice.title || <T>Untitled</T>}
              </h1>

              {notice.content ? (
                <div
                  className="mt-8 text-gray-900 font-light"
                  dangerouslySetInnerHTML={{ __html: notice.content }}
                />
              ) : (
                <p className="mt-8 text-sm font-light text-neutral-500">
                  <T>Full notice content will appear here soon.</T>
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