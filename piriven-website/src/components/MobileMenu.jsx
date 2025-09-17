'use client';

import React from 'react';
import { Home, Info, Download, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const MobileMenu = ({ mobileMenuOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'HOME', Icon: Home },
    { href: '/about', label: 'ABOUT US', Icon: Info },
    { href: '/downloads', label: 'DOWNLOADS', Icon: Download },
    { href: '/contact', label: 'CONTACT US', Icon: Mail },
  ];

  return (
    <div
      // Use the same background color as the main nav
      className={`md:hidden bg-red-800 shadow-lg transform transition-all duration-500 ease-in-out overflow-hidden ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <ul className="flex flex-col space-y-2 p-4">
        {navItems.map(({ href, label, Icon }, index) => {
          const active = pathname === href;

          return (
            <li
              key={href}
              // FIX: Apply animation delay via inline style
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`transform transition-all duration-300 ${
                mobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4'
              }`}
            >
              <Link
                href={href}
                className={`flex w-full items-center space-x-3 px-4 py-3 rounded-lg font-semibold tracking-wider uppercase text-sm transition-colors duration-300 ${
                  active
                    ? 'bg-red-900/50 text-yellow-300' // Active state: darker red bg, yellow text
                    : 'text-white hover:bg-red-700/50 hover:text-yellow-300' // Default state
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    active ? 'scale-110' : ''
                  }`}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};