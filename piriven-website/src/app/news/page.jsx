'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

      <main className="mx-auto px-6 md:px-10 py-18">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All News</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading news…</T></p>
          ) : null}
        </section>

        {!loading && !news.length ? (
          <div className="text-center text-neutral-600 font-light">
            <T>No news articles yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
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
                <p className="text-xs font-light uppercase tracking-wide text-neutral-500">
                  {item.date}
                  {item.time ? <span className="ml-2 text-neutral-400">{item.time}</span> : null}
                </p>
                <h2 className="mt-3 text-xl font-light text-gray-900 leading-snug group-hover:text-red-800 transition-colors">
                  {item.title}
                </h2>
                {item.excerpt ? (
                  <p className="mt-3 text-sm text-neutral-600 font-light line-clamp-3">{item.excerpt}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center text-sm font-light text-red-800">
                    <T>Read full story</T>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-12">
          <Link href="/">
            <button className="cursor-pointer bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
              ← <T>Back to Home</T>
            </button>
          </Link>
        </div>
        
      </main>

      <Footer />

      
    </div>
    
  );
}