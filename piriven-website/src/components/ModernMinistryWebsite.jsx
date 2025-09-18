'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import T from '@/components/T';

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
import { fetchSlides, fetchNews, fetchNotices, fetchEvents, fetchVideos, fetchStats, fetchLinks, fetchAlbums, mediaUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { translateText } from '@/lib/i18n';

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


  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    // Try loading slides from the backend API (fallback to defaults on failure)
    (async () => {
      try {
        const data = await fetchSlides();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length) {
          let normalized = list
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((s) => ({
              image: mediaUrl(s.image),
              title: s.title,
              subtitle: s.subtitle,
              button_label: s.button_label,
              button_url: s.button_url,
            }));
          // Translate slide titles/subtitles/buttons
          normalized = await Promise.all(
            normalized.map(async (it) => ({
              ...it,
              title: await translateText(it.title, lang),
              subtitle: await translateText(it.subtitle, lang),
              button_label: await translateText(it.button_label || '', lang),
            }))
          );
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
        const mappedRaw = list.slice(0, 6).map((n, idx) => ({
          title: n.title,
          image: n.image ? mediaUrl(n.image) : `/images/newsItem${(idx % 6) + 1}.jpg`,
          date: new Date(n.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date(n.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        const mapped = await Promise.all(
          mappedRaw.map(async (it) => ({ ...it, title: await translateText(it.title, lang) }))
        );
        setNewsItems(mapped);
      } catch {}
    })();

    // Load notices
    (async () => {
      try {
        const data = await fetchNotices();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const mappedRaw = list.slice(0, 8).map((n) => ({
          title: n.title,
          image: n.image ? mediaUrl(n.image) : '',
          date: new Date(n.published_at).toDateString(),
        }));
        const mapped = await Promise.all(
          mappedRaw.map(async (it) => ({ ...it, title: await translateText(it.title, lang) }))
        );
        setNotices(mapped);
      } catch {}
    })();

    // Load videos
    (async () => {
      try {
        const data = await fetchVideos();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const translated = await Promise.all(
          list.map(async (v) => ({ ...v, title: await translateText(v.title, lang) }))
        );
        setVideoList(translated);
      } catch {}
    })();

    // Load stats
    (async () => {
      try {
        const data = await fetchStats();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length) {
          const translated = await Promise.all(
            list.map(async (s) => ({ ...s, label: await translateText(s.label, lang) }))
          );
          setStats(translated.map((s, i) => ({ number: s.value, label: s.label, icon: [<BookOpen className="w-12 h-12" />, <Users className="w-12 h-12" />, <GraduationCap className="w-12 h-12" />, <Users className="w-12 h-12" />][i % 4] })));
        }
      } catch {}
    })();

    // Load right side links
    (async () => {
      try {
        const data = await fetchLinks();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const translated = await Promise.all(
          list.map(async (l) => ({ ...l, name: await translateText(l.name, lang) }))
        );
        setQuickLinks(translated);
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
      
      <main className="container mx-auto px-6 py-16">
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-slide-up">
              <T>Welcome to</T>
              <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x mt-2">
                <T>Piriven & Bhikkhu Education</T>
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg animate-slide-up animation-delay-200">
              <T>The Tripitaka literature states that the word Pirivena has been used since the time of the Buddha to refer to the monastery or hut where the monks lived. Pirivena is a traditional educational institution that has been operating in Sri Lanka for centuries, creating exemplary Bhikkhu leadership through disciplinary practices imposed by the Lord Buddha.</T>
            </p>
            <div className="flex space-x-6 animate-slide-up animation-delay-400">
              <Link href="/full-explanation">
                <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:rotate-1 active:scale-95">
                  <T>Read More</T>
                </button>
              </Link>
              <button className="bg-orange-500 hover:bg-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:-rotate-1 active:scale-95">
                <T>IT Test</T>
              </button>
            </div>
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
            <h2 className="text-4xl font-bold text-gray-800 mb-12 animate-slide-up"><T>Latest News</T></h2>
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
              <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95">
                <T>View All News</T>
              </button>
            </div>
          </div>
          <div className="lg:col-span-1 animate-slide-up animation-delay-300">
            <h2 className="text-4xl font-bold text-gray-800 mb-8"><T>Notices</T></h2>
            <div className="bg-white rounded-2xl p-6 shadow-lg h-96 overflow-y-auto hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <NoticeCard items={notices} />
              </div>
            </div>
            <div className="text-center mt-6">
              <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95">
                <T>View All Notices</T>
              </button>
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
              <h2 className="text-4xl font-bold text-gray-800 mb-8"><T>Calendar</T></h2>
              <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
                <CalendarComponent />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8 animate-slide-up animation-delay-300">
              <div className="space-y-6">
                {quickLinks.map((link, index) => (
                  <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 150 + 600}ms`, animationFillMode: 'both' }}>
                    <RightSideLink icon={<LinkIcon className="text-white w-6 h-6" />} text={link.name} url={link.url} />
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

