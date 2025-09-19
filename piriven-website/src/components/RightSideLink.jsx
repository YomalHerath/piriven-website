import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export const RightSideLink = ({ icon, text, textSi, url }) => {
  const { lang } = useLanguage();
  const label = preferLanguage(text, textSi, lang);
  return (
    <a 
      href={url || '#'} 
      target={url ? '_blank' : undefined} 
      rel={url ? 'noopener noreferrer' : undefined} 
      className="flex items-center space-x-6 group bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex-shrink-0 h-16 w-16 bg-transparent border-2 border-black rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
        {React.cloneElement(icon, { className: 'text-black w-6 h-6 group-hover:text-white transition-colors duration-300' })}
      </div>
      <span className="text-xl font-light text-gray-800 group-hover:text-red-800 transition-colors duration-300">
        {label}
      </span>
    </a>
  );
};