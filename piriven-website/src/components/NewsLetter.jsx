import React from 'react';
import T from '@/components/T';

export const NewsletterSection = () => (
  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
    <div className="space-y-4">
      <h3 className="text-2xl font-bold"><T>Subscribe</T></h3>
      <h4 className="text-2xl font-semibold opacity-90"><T>Our Newsletter</T></h4>
      <p className="text-blue-100"><T>Stay updated with the latest news and announcements from our ministry.</T></p>
      <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
        <T>Subscribe Now</T>
      </button>
    </div>
  </div>
);
