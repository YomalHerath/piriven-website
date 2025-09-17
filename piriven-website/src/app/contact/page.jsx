'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import Link from 'next/link';
import { sendContact, fetchContactInfo } from '@/lib/api';

const ContactPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 🆕 Add state for scroll-based animations
  const [sectionsVisible, setSectionsVisible] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(null);

  // 🆕 Add the useEffect hook for IntersectionObserver
  useEffect(() => {
    // Load contact info from backend
    (async () => {
      try {
        const data = await fetchContactInfo();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length) setInfo(list[0]);
      } catch {}
    })();

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

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />
      <main className="container mx-auto px-6 py-16">
        <section
          id="contact-header"
          data-animate
          className={`transition-all duration-1000 transform ${
            sectionsVisible['contact-header'] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-slide-up">Contact Us</h1>
          <p className="text-lg text-gray-600 animate-slide-up animation-delay-200">
            This is the Contact Us page. Here you can find our contact details, location, and a contact form.
          </p>
        </section>

        {/* Contact form */}
        <section
          id="contact-form"
          data-animate
          className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 transition-all duration-1000 transform ${
            sectionsVisible['contact-form'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Send us a message</h2>
            <p className="text-gray-600 mb-6">We’ll get back to you as soon as possible.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setError('');
                try {
                  await sendContact(form);
                  setSubmitted(true);
                  setForm({ name: '', email: '', subject: '', message: '' });
                } catch (err) {
                  setError('Failed to send message. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input required value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input value={form.subject} onChange={(e)=>setForm({ ...form, subject: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea required rows={6} value={form.message} onChange={(e)=>setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700" />
              </div>
              {error && <p className="text-red-700 text-sm">{error}</p>}
              {submitted && <p className="text-green-700 text-sm">Thanks! Your message has been sent.</p>}
              <button disabled={submitting} className="bg-black disabled:opacity-60 hover:bg-yellow-400 hover:text-black text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact details</h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{info?.organization || 'Division of Piriven Education'}</p>
              <p>{info?.address || 'Isurupaya, Battaramulla, Sri Lanka'}</p>
              <p>
                Phone: {info?.phone ? (<a className="text-red-800" href={`tel:${info.phone}`}>{info.phone}</a>) : (
                  <a className="text-red-800" href="tel:+94112785141">+94 112 785 141</a>
                )}
              </p>
              <p>
                Email: {info?.email ? (<a className="text-red-800" href={`mailto:${info.email}`}>{info.email}</a>) : (
                  <a className="text-red-800" href="mailto:info@moe.gov.lk">info@moe.gov.lk</a>
                )}
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg border">
              {info?.map_embed ? (
                <div dangerouslySetInnerHTML={{ __html: info.map_embed }} />
              ) : (
                <iframe
                  title="map"
                  src={info?.map_url || 'https://www.google.com/maps?q=Isurupaya%2C%20Battaramulla%2C%20Sri%20Lanka&output=embed' }
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {/* 🆕 Add the CSS animations */}
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
        

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default ContactPage;
