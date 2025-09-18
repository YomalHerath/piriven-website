import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export const RightSideLink = ({ icon, text, textSi, url }) => {
  const { lang } = useLanguage();
  const label = preferLanguage(text, textSi, lang);
  return (
    <a href={url || '#'} target={url ? '_blank' : undefined} rel={url ? 'noopener noreferrer' : undefined} className="flex items-center space-x-6 group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex-shrink-0 h-16 w-16 bg-black rounded-full flex items-center justify-center group-hover:bg-red-800 transition-colors duration-300">
        {icon}
      </div>
      <span className="text-xl font-semibold text-gray-800 group-hover:text-red-800 transition-colors duration-300">
        {label}
      </span>
    </a>
  );
};
