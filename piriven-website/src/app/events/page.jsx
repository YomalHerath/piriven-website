'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchEvents } from '@/lib/api';
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

function eventStatus(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : start;
  if (!start) return '';
  if (end && end < now) return 'past';
  if (start > now) return 'upcoming';
  return 'ongoing';
}

const statusLabels = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  past: 'Concluded',
};

const statusStyles = {
  upcoming: 'bg-blue-100 text-blue-600',
  ongoing: 'bg-green-100 text-green-600',
  past: 'bg-neutral-200 text-neutral-600',
};

export default function EventsPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchEvents();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load events');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const events = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const start = item?.start_date || '';
    const end = item?.end_date || '';
    const status = eventStatus(start, end);
    const badgeClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs ' + (statusStyles[status] || '');
    return {
      id: item?.id ?? title,
      title,
      description,
      startFormatted: formatDate(start),
      endFormatted: formatDate(end),
      status,
      badgeClass,
      badgeLabel: status ? statusLabels[status] : '',
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
            <T>All Events</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600"><T>Loading events…</T></p>
          ) : null}
        </section>

        {!loading && !events.length ? (
          <div className="text-center text-neutral-600">
            <T>No events scheduled yet.</T>
          </div>
        ) : null}

        <div className="space-y-6">
          {events.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-neutral-500">
                <span>
                  {event.startFormatted || <T>Undated</T>}
                  {event.endFormatted ? (
                    <span className="text-neutral-400">
                      {' '}→ {event.endFormatted}
                    </span>
                  ) : null}
                </span>
                {event.badgeLabel ? (
                  <span className={event.badgeClass}>
                    <T>{event.badgeLabel}</T>
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900 leading-snug">
                {event.title}
              </h2>
              {event.description ? (
                <p className="mt-4 text-sm text-neutral-600 whitespace-pre-line">
                  {event.description}
                </p>
              ) : null}
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
