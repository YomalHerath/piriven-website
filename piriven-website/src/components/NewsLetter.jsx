import React from 'react';
import T from '@/components/T';

export const NewsletterSection = () => (
  <div className="bg-red-800 rounded-lg p-8 text-white shadow-xl">
    <div className="space-y-4">
      <h3 className="text-2xl font-light"><T>Subscribe</T></h3>
      <h4 className="text-2xl font-light opacity-90"><T>Our Newsletter</T></h4>
      <p className="text-white/90 font-light"><T>Stay updated with the latest news and announcements from our ministry.</T></p>
      <button className="bg-yellow-300 text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg font-light transition-colors duration-300">
        <T>Subscribe Now</T>
      </button>
    </div>
  </div>
);