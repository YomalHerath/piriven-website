'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import T from '@/components/T';
import { MapPin, Mail, Phone } from 'lucide-react';
import { fetchFooterAbout, fetchFooterLinks, fetchContactInfo } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';


function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.results)) return payload.results;
  }
  return [];
}

export const Footer = () => {
  const { lang } = useLanguage();
  const [aboutEntries, setAboutEntries] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [aboutRaw, linksRaw, contactRaw] = await Promise.all([
          fetchFooterAbout().catch(() => []),
          fetchFooterLinks().catch(() => []),
          fetchContactInfo().catch(() => []),
        ]);

        if (ignore) return;

        setAboutEntries(normalizeList(aboutRaw));
        setQuickLinks(normalizeList(linksRaw));
        const contactList = normalizeList(contactRaw);
        setContactInfo(contactList.length ? contactList[0] : null);
      } catch {
        if (!ignore) {
          setAboutEntries([]);
          setQuickLinks([]);
          setContactInfo(null);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const aboutContent = useMemo(() => {
    if (!aboutEntries.length) return null;
    const entry = aboutEntries[0];
    const title = preferLanguage(entry.title, entry.title_si, lang) || entry.title || '';
    const body = preferLanguage(entry.body, entry.body_si, lang) || entry.body || '';
    if (!title && !body) return null;
    return { title, body };
  }, [aboutEntries, lang]);

  const localizedLinks = useMemo(() => {
    return quickLinks
      .map((item) => ({
        id: item.id || item.url || item.name,
        name: preferLanguage(item.name, item.name_si, lang) || item.name || '',
        url: item.url || '#',
      }))
      .filter((item) => item.name);
  }, [quickLinks, lang]);

  const contactDetails = useMemo(() => {
    if (!contactInfo) return null;

    const { address, address_si, email, phone, organization, organization_si, map_url, map_embed, latitude, longitude, map_zoom } = contactInfo;

    return {
      address: preferLanguage(address, address_si, lang) || address || '',
      email: email || '',
      phone: phone || '',
      organization: preferLanguage(organization, organization_si, lang) || organization || '',
      mapUrl: map_embed || map_url || '',
      latitude: typeof latitude === 'number' ? latitude : latitude ? Number(latitude) : null,
      longitude: typeof longitude === 'number' ? longitude : longitude ? Number(longitude) : null,
      mapZoom: map_zoom || 15,
    };
  }, [contactInfo, lang]);

  const mapSrc = useMemo(() => {
    if (
      contactDetails &&
      contactDetails.latitude !== null &&
      contactDetails.longitude !== null
    ) {
      const rawZoom = Number(contactDetails.mapZoom ?? 15);
      const zoom = Number.isFinite(rawZoom)
        ? Math.min(Math.max(rawZoom, 1), 20)
        : 15;
      return `https://www.google.com/maps?q=${contactDetails.latitude},${contactDetails.longitude}&hl=${lang === 'si' ? 'si' : 'en'}&z=${zoom}&output=embed`;
    }
    if (contactDetails?.mapUrl) {
      return contactDetails.mapUrl;
    }
    return '';
  }, [contactDetails, lang]);

  return (
    <footer className="relative bg-black text-gray-300">
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-light text-xl mb-6 text-yellow-300">
              {aboutContent?.title || <T>About Us</T>}
            </h4>
            {aboutContent ? (
              <p className="font-light leading-relaxed text-gray-400 hover:text-gray-200 transition-colors duration-300 whitespace-pre-line">
                {aboutContent.body}
              </p>
            ) : (
              <p className="text-sm font-light text-gray-500">
                <T>Footer about content will appear here once added in the admin.</T>
              </p>
            )}
          </div>

          <div>
            <h4 className="font-light text-xl mb-6 text-yellow-300">
              <T>Quick Links</T>
            </h4>
            {localizedLinks.length ? (
              <ul className="space-y-3">
                {localizedLinks.slice(0, 6).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url || '#'}
                      className="group inline-block transition-all duration-300"
                      target={link.url && link.url.startsWith('http') ? '_blank' : undefined}
                      rel={link.url && link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <span className="relative text-gray-400 font-light group-hover:text-yellow-300 transition-colors duration-300">
                        {link.name}
                      </span>
                      <span className="block h-[2px] max-w-0 group-hover:max-w-full bg-yellow-300 transition-all duration-500"></span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-light text-gray-500">
                <T>No footer links yet.</T>
              </p>
            )}
          </div>

          <div>
            <h4 className="font-light text-xl mb-6 text-yellow-300">
              <T>Contact Us</T>
            </h4>
            {contactDetails ? (
              <div className="space-y-4">
                {contactDetails.organization ? (
                  <div className="text-sm text-gray-400 uppercase tracking-wide font-light">
                    {contactDetails.organization}
                  </div>
                ) : null}
                {contactDetails.address ? (
                  <div className="flex items-start space-x-3 group">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-300" />
                    <span className="font-light group-hover:text-white transition-colors duration-300">
                      {contactDetails.address}
                    </span>
                  </div>
                ) : null}
                {contactDetails.email ? (
                  <div className="flex items-center space-x-3 group">
                    <Mail className="w-5 h-5 text-yellow-300" />
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="font-light group-hover:text-white transition-colors duration-300"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                ) : null}
                {contactDetails.phone ? (
                  <div className="flex items-center space-x-3 group">
                    <Phone className="w-5 h-5 text-yellow-300" />
                    <a
                      href={`tel:${contactDetails.phone}`}
                      className="font-light group-hover:text-white transition-colors duration-300"
                    >
                      {contactDetails.phone}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm font-light text-gray-500">
                <T>Contact information will appear here once added.</T>
              </p>
            )}
          </div>

          <div>
            <h4 className="font-light text-xl mb-6 text-yellow-300">
              <T>Location</T>
            </h4>
            {mapSrc ? (
              <div className="w-full h-32 rounded-lg overflow-hidden shadow-lg">
                {mapSrc.startsWith('<') ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: mapSrc }}
                  />
                ) : (
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location map"
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center text-sm text-gray-500">
                <T>Map will appear here once configured.</T>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300 font-light">
            © {new Date().getFullYear()} State Ministry of Dhamma School, Piriven & Bhikku Education. <T>All Rights Reserved.</T>
          </p>
        </div>
      </div>
    </footer>
  );
};