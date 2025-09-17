// components/Footer.jsx
import React from 'react';
import T from '@/components/T';
import { MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => (
  <footer className="relative bg-gray-900 text-gray-300">
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 via-yellow-900/20 to-blue-900/30 pointer-events-none"></div>
    
    <div className="relative container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About */}
        <div>
          <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            <T>About Us</T>
          </h4>
          <p className="leading-relaxed text-gray-400 hover:text-gray-200 transition-colors duration-300">
            <T>The State Ministry is dedicated to the development and administration of Dhamma Schools, Piriven, and Bhikku Education in Sri Lanka.</T>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            <T>Quick Links</T>
          </h4>
          <ul className="space-y-3">
            {['Ministry of Education', 'Department of Examinations', 'NIE', 'UGC'].map((link, index) => (
              <li key={index}>
                <a 
                  href="#"
                  className="group inline-block transition-all duration-300"
                >
                  <span className="relative text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
                    {link}
                  </span>
                  <span className="block h-[2px] max-w-0 group-hover:max-w-full bg-yellow-400 transition-all duration-500"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            <T>Contact Us</T>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <MapPin className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">
                Isurupaya, Battaramulla, Sri Lanka
              </span>
            </div>
            <div className="flex items-center space-x-3 group">
              <Mail className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">
                info@moe.gov.lk
              </span>
            </div>
            <div className="flex items-center space-x-3 group">
              <Phone className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">
                +94 112 785 141
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            <T>Location</T>
          </h4>
          <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg">
  <iframe
    src="https://www.google.com/maps?q=7.2876032,80.6879232&hl=en&z=15&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <p className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300">
          © 2025 State Ministry of Dhamma School, Piriven & Bhikku Education. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);
