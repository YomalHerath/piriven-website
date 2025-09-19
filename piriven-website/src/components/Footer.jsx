'use client';

import T from '@/components/T';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FOOTER_CONTENT = {
  about: {
    en: 'The State Ministry is dedicated to the development and administration of Dhamma Schools, Piriven, and Bhikku Education in Sri Lanka.',
    si: 'ශ්‍රී ලංකාවේ ධර්ම පාසල්, පිරිවෙන් සහ භික්ෂු අධ්‍යාපනය සංවර්ධනය සහ කළමනාකරණය සඳහා අපගේ අමාත්‍යාංශය කැපවී සිටී.'
  },
  contact: {
    organization: {
      en: 'Division of Piriven Education',
      si: 'පිරිවෙන් අධ්‍යාපන අංශය',
    },
    address: {
      en: 'Isurupaya, Battaramulla, Sri Lanka',
      si: 'ඉසුරුපාය, බත්තරමුල්ල, ශ්‍රී ලංකාව',
    },
    phone: '+94 112 785 141',
    email: 'info@moe.gov.lk',
    mapSrc: 'https://www.google.com/maps?q=Isurupaya,+Battaramulla,+Sri+Lanka&hl=en&z=16&output=embed',
  },
  links: [
    { id: 'moe', name: 'Ministry of Education', url: 'https://moe.gov.lk/' },
    { id: 'doe', name: 'Department of Examinations', url: 'https://doenets.lk/' },
    { id: 'nie', name: 'National Institute of Education', url: 'https://nie.lk/' },
    { id: 'ugc', name: 'University Grants Commission', url: 'https://ugc.ac.lk/' },
  ],
};

export const Footer = () => {
  const { lang } = useLanguage();
  const isSinhala = lang === 'si';
  const aboutBody = FOOTER_CONTENT.about[isSinhala ? 'si' : 'en'];
  const contact = FOOTER_CONTENT.contact;

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 via-yellow-900/20 to-blue-900/30 pointer-events-none" />

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              {isSinhala ? 'අප ගැන' : 'About Us'}
            </h4>
            <p className="leading-relaxed text-gray-400 hover:text-gray-200 transition-colors duration-300 whitespace-pre-line">
              {aboutBody}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              {isSinhala ? 'ඉක්මන් සබැඳි' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {FOOTER_CONTENT.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="group inline-block transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="relative text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
                      {link.name}
                    </span>
                    <span className="block h-[2px] max-w-0 group-hover:max-w-full bg-yellow-400 transition-all duration-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              {isSinhala ? 'අදහස් හා විමසුම්' : 'Contact Us'}
            </h4>
            <div className="space-y-4">
              <div className="text-sm text-gray-400 uppercase tracking-wide font-semibold">
                {contact.organization[isSinhala ? 'si' : 'en']}
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-yellow-400" />
                <span>{contact.address[isSinhala ? 'si' : 'en']}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              {isSinhala ? 'ස්ථානය' : 'Location'}
            </h4>
            <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={contact.mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300">
            © {new Date().getFullYear()} State Ministry of Dhamma School, Piriven & Bhikku Education.{' '}
            <T>All Rights Reserved.</T>
          </p>
        </div>
      </div>
    </footer>
  );
};
