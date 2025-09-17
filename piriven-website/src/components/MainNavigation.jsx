'use client';

import React from 'react';
import { Home, Info, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import T from '@/components/T';

export const MainNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'HOME', Icon: Home },
    { href: '/about', label: 'ABOUT US', Icon: Info },
    { href: '/downloads', label: 'DOWNLOADS', Icon: Download },
    { href: '/contact', label: 'CONTACT US', Icon: Mail },
  ];

  return (
    <nav className="bg-red-800 shadow-2xl relative z-20">
      <div className="container mx-auto px-6">
        <ul className="hidden md:flex justify-center space-x-12 text-white">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;

            return (
              <li key={href} className="relative group">
                <Link
                  href={href}
                  className={`flex items-center space-x-2 py-4 font-medium tracking-wider text-sm uppercase transition-colors duration-300 ${
                    active ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
                  }`}
                >
                  {/* Icon hover tilt */}
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      active
                        ? 'text-yellow-300 rotate-0'
                        : 'group-hover:-rotate-12 group-hover:scale-110'
                    }`}
                  />
                  <T>{label}</T>
                </Link>

                {/* Underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[3px] w-full transform origin-left transition-transform duration-500 ${
                    active
                      ? 'scale-x-100 bg-yellow-400 animate-underline'
                      : 'scale-x-0 bg-yellow-300 group-hover:scale-x-100'
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        @keyframes underline-grow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .animate-underline {
          animation: underline-grow 0.4s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};
