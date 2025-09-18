'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchVideos, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

export default function VideosPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchVideos();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load videos');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const videos = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const playback = item?.url || mediaUrl(item?.file) || '';
    const thumbnail = mediaUrl(item?.thumbnail);
    return {
      id: item?.id ?? title,
      title,
      description,
      playback,
      thumbnail,
      hasExternal: Boolean(item?.url),
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
            <T>All Videos</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600"><T>Loading videos…</T></p>
          ) : null}
        </section>

        {!loading && !videos.length ? (
          <div className="text-center text-neutral-600">
            <T>No videos published yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-56 bg-neutral-200">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">
                    <T>No thumbnail</T>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold text-gray-900 leading-snug">
                  {video.title}
                </h2>
                {video.description ? (
                  <p className="mt-3 text-sm text-neutral-600 line-clamp-4">{video.description}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  {video.playback ? (
                    <a
                      href={video.playback}
                      target={video.hasExternal ? '_blank' : '_self'}
                      rel={video.hasExternal ? 'noreferrer' : undefined}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <T>Play video</T>
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-sm font-semibold text-neutral-400">
                      <T>Video unavailable</T>
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
