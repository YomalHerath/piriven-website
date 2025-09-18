'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { ChevronLeft, ChevronRight, BookOpen, Users, GraduationCap, Search, Link as LinkIcon } from 'lucide-react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { HeroSlider } from './HeroSlider';
import { MainNavigation } from './MainNavigation';
import { StatCard } from './StatCard';
import { NewsCard } from './NewsCard';
import { GallerySlider } from './GallerySlider';
import { NoticeCard } from './NoticeCard';
import { RightSideLink } from './RightSideLink';
import { CalendarComponent } from './Calendar';
import { PublicationsSection } from './Publications';
import { VideosSection } from './Videos';
import { NewsletterSection } from './NewsLetter';
import { Footer } from './Footer';
import T from '@/components/T';
import { fetchSlides, fetchNews, fetchNotices, fetchEvents, fetchVideos, fetchStats, fetchLinks, fetchAlbums, fetchHeroIntro, fetchSiteTextSnippets, mediaUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

const ModernMinistryWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gallerySlide, setGallerySlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsVisible, setSectionsVisible] = useState({});
  const { lang } = useLanguage();
  
  const [mainSlides, setMainSlides] = useState([]);

  const [galleryImages, setGalleryImages] = useState([]);

  const [newsItems, setNewsItems] = useState([]);
  const [notices, setNotices] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [stats, setStats] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [heroIntro, setHeroIntro] = useState(null);
  const [textSnippets, setTextSnippets] = useState({});

  const snippetText = (key, fallback = '') => {
    const snippet = textSnippets[key];
    if (!snippet) return fallback;
    return preferLanguage(snippet.text, snippet.text_si, lang) || fallback;
  };

  const heroHeading = heroIntro ? preferLanguage(heroIntro.heading, heroIntro.heading_si, lang) : '';
  const heroHighlight = heroIntro ? preferLanguage(heroIntro.highlight, heroIntro.highlight_si, lang) : '';
  const heroDescription = heroIntro ? preferLanguage(heroIntro.description, heroIntro.description_si, lang) : '';
  const heroPrimaryLabel = heroIntro ? preferLanguage(heroIntro.primary_label, heroIntro.primary_label_si, lang) : '';
  const heroSecondaryLabel = heroIntro ? preferLanguage(heroIntro.secondary_label, heroIntro.secondary_label_si, lang) : '';
  const heroPrimaryUrl = heroIntro?.primary_url || '#';
  const heroSecondaryUrl = heroIntro?.secondary_url || '#';

  const fallbackHeroHeading = snippetText('home_hero_heading', '');
  const fallbackHeroHighlight = snippetText('home_hero_highlight', '');
  const fallbackHeroDescription = snippetText('home_hero_description', '');
  const fallbackPrimaryLabel = snippetText('home_hero_primary_label', '');
  const fallbackSecondaryLabel = snippetText('home_hero_secondary_label', '');
  const emptyHeroMessage = snippetText('home_hero_empty', 'Welcome section content will appear here once configured in the admin.');

  const resolvedHeading = heroIntro ? (heroHeading || fallbackHeroHeading) : '';
  const resolvedHighlight = heroIntro ? (heroHighlight || fallbackHeroHighlight) : '';
  const resolvedDescription = heroIntro ? (heroDescription || fallbackHeroDescription) : '';
  const resolvedPrimaryLabel = heroIntro ? (heroPrimaryLabel || fallbackPrimaryLabel) : '';
  const resolvedSecondaryLabel = heroIntro ? (heroSecondaryLabel || fallbackSecondaryLabel) : '';

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    (async () => {
      try {
        const data = await fetchHeroIntro();
        const list = Array.isArray(data) ? data : (data?.results || []);
        setHeroIntro(list.length ? list[0] : null);
      } catch {
        setHeroIntro(null);
      }
    })();

    (async () => {
      try {
        const data = await fetchSiteTextSnippets();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const map = {};
        list.forEach((item) => {
          map[item.key] = item;
        });
        setTextSnippets(map);
      } catch {
        setTextSnippets({});
      }
    })();

    // Try loading slides from the backend API (fallback to defaults on failure)
    (async () => {
      try {
        const data = await fetchSlides();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length) {
          const normalized = list
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((s) => ({
              image: mediaUrl(s.image),
              title: preferLanguage(s.title, s.title_si, lang),
              subtitle: preferLanguage(s.subtitle, s.subtitle_si, lang),
            }));
          setMainSlides(normalized);
          setCurrentSlide(0);
        }
      } catch (e) {}
    })();

    // Load news
    (async () => {
      try {
        const data = await fetchNews();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const mapped = list.slice(0, 6).map((n, idx) => {
          const title = preferLanguage(n.title, n.title_si, lang);
          const slug = n.slug || (n.id ? String(n.id) : '');
          const publishedAt = n.published_at ? new Date(n.published_at) : null;
          return {
            id: n.id,
            slug,
            href: slug ? `/news/${slug}` : '#',
            title,
            image: n.image ? mediaUrl(n.image) : `/images/newsItem${(idx % 6) + 1}.jpg`,
            date: publishedAt
              ? publishedAt.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '',
            time: publishedAt
              ? publishedAt.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
          };
        });
        setNewsItems(mapped);
      } catch {}
    })();

    // Load notices
    (async () => {
      try {
        const data = await fetchNotices();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const mapped = list.slice(0, 8).map((n) => {
          const published = n.published_at ? new Date(n.published_at) : null;
          return {
            id: n.id,
            href: n.id ? `/notices/${n.id}` : n.url || '#',
            title: preferLanguage(n.title, n.title_si, lang),
            image: n.image ? mediaUrl(n.image) : '',
            date: published ? published.toDateString() : '',
          };
        });
        setNotices(mapped);
      } catch {}
    })();

    // Load videos
    (async () => {
      try {
        const data = await fetchVideos();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const normalizedVideos = list.map((v) => ({
          ...v,
          title: preferLanguage(v.title, v.title_si, lang),
          description: preferLanguage(v.description, v.description_si, lang),
        }));
        setVideoList(normalizedVideos);
      } catch {}
    })();

    // Load stats
    (async () => {
      try {
        const data = await fetchStats();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length) {
          const statsWithLabels = list.map((s, i) => ({
            number: preferLanguage(s.value, s.value_si, lang) || s.value,
            label: preferLanguage(s.label, s.label_si, lang),
            icon: [<BookOpen className="w-12 h-12" />, <Users className="w-12 h-12" />, <GraduationCap className="w-12 h-12" />, <Users className="w-12 h-12" />][i % 4],
          }));
          setStats(statsWithLabels);
        }
      } catch {}
    })();

    // Load right side links
    (async () => {
      try {
        const data = await fetchLinks();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const localizedLinks = list.map((l) => ({
          ...l,
          name: preferLanguage(l.name, l.name_si, lang),
        }));
        setQuickLinks(localizedLinks);
      } catch {}
    })();

    // Load gallery from first album
    (async () => {
      try {
        const data = await fetchAlbums();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length && Array.isArray(list[0].images)) {
          const imgs = list[0].images.map((img) => mediaUrl(img.image));
          if (imgs.length) setGalleryImages(imgs);
        }
      } catch {}
    })();

    const mainTimer = setInterval(() => {
      if (mainSlides.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
      }
    }, 5000);
    
    const galleryTimer = setInterval(() => {
      if (galleryImages.length > 0) {
        setGallerySlide((prev) => (prev + 1) % galleryImages.length);
      }
    }, 3000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (!isLoading) {
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => observer.observe(section));
    }

    return () => {
      clearInterval(mainTimer);
      clearInterval(galleryTimer);
      clearTimeout(loadingTimer);
      observer.disconnect();
    };
  }, [isLoading, mainSlides.length, lang]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <HeroSlider mainSlides={mainSlides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <MainNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-16">
        {/* Welcome Section */}
        <section 
          id="welcome"
          data-animate
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 transition-all duration-1000 transform ${
            sectionsVisible.welcome 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="space-y-8">
            {heroIntro ? (
              <>
                {(resolvedHeading || resolvedHighlight) ? (
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-slide-up">
                    {resolvedHeading ? <span className="block">{resolvedHeading}</span> : null}
                    {resolvedHighlight ? (
                      <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x mt-2">
                        {resolvedHighlight}
                      </span>
                    ) : null}
                  </h2>
                ) : null}
                <p className="text-gray-600 leading-relaxed text-lg animate-slide-up animation-delay-200">
                  {resolvedDescription || emptyHeroMessage}
                </p>
                {(resolvedPrimaryLabel || resolvedSecondaryLabel) ? (
                  <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 animate-slide-up animation-delay-400">
                    {resolvedPrimaryLabel ? (
                      <Link href={heroPrimaryUrl || '#'}>
                        <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:rotate-1 active:scale-95">
                          {resolvedPrimaryLabel}
                        </button>
                      </Link>
                    ) : null}
                    {resolvedSecondaryLabel ? (
                      <Link href={heroSecondaryUrl || '#'}>
                        <button className="bg-orange-500 hover:bg-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:-rotate-1 active:scale-95">
                          {resolvedSecondaryLabel}
                        </button>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 shadow-sm animate-slide-up">
                <p className="text-gray-500 text-lg">{emptyHeroMessage}</p>
              </div>
            )}
          </div>
          <div className="animate-slide-up animation-delay-600">
            <GallerySlider galleryImages={galleryImages} gallerySlide={gallerySlide} setGallerySlide={setGallerySlide} />
          </div>
        </section>


        {/* Stats Section */}
        <section
          id="stats"
          data-animate
          className={`py-20 transition-all duration-1000 transform ${
            sectionsVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-16 rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="animate-scale-up" style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'both' }}>
                  <StatCard stat={stat} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section
          id="news"
          data-animate
          className={`grid grid-cols-1 lg:grid-cols-3 gap-16 py-20 transition-all duration-1000 transform ${
            sectionsVisible.news
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 animate-slide-up">{snippetText('homepage_latest_news_title', 'Latest News')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {newsItems.slice(newsSlide * 3, (newsSlide * 3) + 3).map((news, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <NewsCard news={news} />
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              {/* Previous Button - Matching HeroSlider Style */}
              <button
                onClick={() => setNewsSlide((prev) => Math.max(0, prev - 1))}
                className="group bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:hover:scale-100"
                disabled={newsSlide === 0}
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>
              {/* Next Button - Matching HeroSlider Style */}
              <button
                onClick={() => setNewsSlide((prev) => Math.min(Math.floor(newsItems.length / 3) - 1, prev + 1))}
                className="group bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:hover:scale-100"
                disabled={newsItems.length === 0 || newsSlide >= Math.floor(newsItems.length / 3) - 1}
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/news"
                className="inline-block bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95"
              >
                {snippetText('homepage_latest_news_cta', 'View All News')}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-1 animate-slide-up animation-delay-300">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">{snippetText('homepage_notices_title', 'Notices')}</h2>
            <div className="bg-white rounded-2xl p-6 shadow-lg h-96 overflow-y-auto hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <NoticeCard items={notices} />
              </div>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/notices"
                className="inline-block bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95"
              >
                {snippetText('homepage_notices_cta', 'View All Notices')}
              </Link>
            </div>
          </div>
        </section>

        {/* Publications and Videos Section */}
        <section 
          id="media"
          data-animate
          className={`py-20 transition-all duration-1000 transform ${
            sectionsVisible.media 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="animate-slide-left">
              <PublicationsSection />
            </div>
            <div className="animate-slide-right animation-delay-300">
              <VideosSection videos={videoList} />
            </div>
          </div>
        </section>

        {/* Calendar and Links Section */}
        <section 
          id="calendar"
          data-animate
          className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50 -mx-6 px-6 transition-all duration-1000 transform ${
            sectionsVisible.calendar 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 animate-slide-up">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">{snippetText('homepage_calendar_title', 'Calendar')}</h2>
              <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
                <CalendarComponent />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8 animate-slide-up animation-delay-300">
              <div className="space-y-6">
                {quickLinks.map((link, index) => (
                  <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 150 + 600}ms`, animationFillMode: 'both' }}>
                    <RightSideLink icon={<LinkIcon className="text-white w-6 h-6" />} text={link.name} textSi={link.name_si} url={link.url} />
                  </div>
                ))}
              </div>
              <div className="animate-fade-in animation-delay-1000">
                <NewsletterSection />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-left {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-right {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-up {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default ModernMinistryWebsite;



















