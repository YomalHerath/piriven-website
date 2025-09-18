'use client';

import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang } = useLanguage();
  const searchPlaceholder = lang === 'si' ? 'සොයන්න...' : 'Search...';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white shadow-md relative z-50 transition-all duration-500 ${
        isScrolled ? 'shadow-lg backdrop-blur-sm bg-white/95' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        {/* ✅ Mobile Layout */}
        <div className="flex items-center justify-between md:hidden">
          {/* Left - Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 text-gray-700 group-hover:text-red-600 transition-all duration-300 transform ${
                  mobileMenuOpen
                    ? 'rotate-180 opacity-0 scale-75'
                    : 'rotate-0 opacity-100 scale-100'
                }`}
              />
              <X
                className={`w-6 h-6 text-gray-700 group-hover:text-red-600 transition-all duration-300 transform absolute inset-0 ${
                  mobileMenuOpen
                    ? 'rotate-0 opacity-100 scale-100'
                    : '-rotate-180 opacity-0 scale-75'
                }`}
              />
            </div>
          </button>

          {/* Center - Logo */}
          <a href="/" className="flex justify-center flex-1">
            <img
              src="/images/logo.png"
              alt="Ministry Logo"
              className="h-10 w-auto hover:scale-110 transition-all duration-500 drop-shadow-lg"
            />
          </a>

          {/* Right - Mobile Search */}
          <button className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-colors duration-300 transform hover:scale-110 active:scale-95">
            <Search className="w-5 h-5 text-gray-700 hover:text-red-600 transition-colors duration-300" />
          </button>
        </div>

        {/* ✅ Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          {/* Left - Menu + Logo */}
          <div className="flex items-center space-x-3">
            <a href="/">
              <img
                src="/images/logo.png"
                alt="Ministry Logo"
                className="h-12 md:h-16 w-auto hover:scale-110 transition-all duration-500 drop-shadow-lg"
              />
            </a>
          </div>

          {/* Center - PDMS Title */}
          <div>
            <a
              href="https://pdms.moe.gov.lk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1 className="text-gray-800 font-bold hover:text-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 hover:bg-clip-text text-xl transition-all duration-500 cursor-pointer transform hover:scale-105">
                PDMS
              </h1>
            </a>
          </div>

          {/* Right - Language + Search */}
          <div className="flex flex-col items-end space-y-2">
            {/* Language Switcher (single source of truth) */}
            <LanguageToggle />

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`relative border rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 w-64 ${
                  searchFocused
                    ? 'border-red-400 bg-white shadow-md text-gray-800 placeholder-red-300'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-700 placeholder-gray-500'
                } focus:outline-none`}
              />
              <Search
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  searchValue ? 'text-red-500' : 'text-gray-400'
                }`}
              />
              {searchValue && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-slide-down">
                  <div className="p-3">
                    <p className="text-gray-500 text-xs">Search suggestions</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200">
                        <Search className="w-4 h-4 text-red-400" />
                        <span className="text-gray-700 text-sm">
                          {searchValue} - Pirivenas
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200">
                        <Search className="w-4 h-4 text-red-400" />
                        <span className="text-gray-700 text-sm">
                          {searchValue} - Education
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.25s ease-out;
        }
      `}</style>
    </header>
  );
};



