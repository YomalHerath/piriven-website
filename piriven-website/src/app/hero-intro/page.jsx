'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import { fetchHeroIntro } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

const HeroIntroPage = () => {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [intro, setIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchHeroIntro();
        const list = Array.isArray(data) ? data : data?.results || [];
        if (mounted) {
          setIntro(list.length ? list[0] : null);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load introduction details at this time.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (!intro) return null;
    return {
      heading: preferLanguage(intro.heading, intro.heading_si, lang) || '',
      highlight: preferLanguage(intro.highlight, intro.highlight_si, lang) || '',
      description: preferLanguage(intro.description, intro.description_si, lang) || '',
    };
  }, [intro, lang]);

  const paragraphs = useMemo(() => {
    if (!content?.description) return [];
    return content.description
      .split(/\r?\n+/)
      .map((para) => para.trim())
      .filter(Boolean);
  }, [content]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18 max-w-4xl">
        <section className="mb-10">
          <Link href="/" className="text-sm text-red-800 hover:text-black transition-colors">
            ← {lang === 'si' ? 'මුල් පිටුවට' : 'Back to Home'}
          </Link>
        </section>

        {loading ? (
          <p className="text-gray-600 text-sm">
            {lang === 'si' ? 'දත්ත පූර්ව පූරණය වෙමින් පවතී…' : 'Loading introduction…'}
          </p>
        ) : error ? (
          <p className="text-red-700 text-sm">{error}</p>
        ) : !content ? (
          <p className="text-gray-600 text-sm">
            {lang === 'si'
              ? 'ඔබට පෙන්වීමට හේත්තාගත තොරතුරු දැනට නොමැත.'
              : 'No introduction details available yet.'}
          </p>
        ) : (
          <article className="space-y-8">
            <header className="space-y-4">
              {content.heading ? (
                <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                  {content.heading}
                </h1>
              ) : null}
              {content.highlight ? (
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent">
                  {content.highlight}
                </h2>
              ) : null}
            </header>

            {paragraphs.length ? (
              <div className="space-y-5 text-gray-700 text-lg leading-relaxed font-light">
                {paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg font-light">
                {lang === 'si'
                  ? 'විස්තරාත්මක විස්තරයක් මෙතෙක් ඇතුළත් කර නොමැත.'
                  : 'Detailed introduction has not been provided yet.'}
              </p>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HeroIntroPage;