import React from 'react';

import Link from 'next/link';
import T from '@/components/T';

export const GallerySlider = ({ galleryImages, gallerySlide, setGallerySlide }) => (
  <div className="space-y-6">
    <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
      {galleryImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === gallerySlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <img 
            src={image} 
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="flex justify-center space-x-2">
      {galleryImages.map((_, index) => (
        <button
          key={index}
          onClick={() => setGallerySlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === gallerySlide ? 'bg-red-800 scale-125' : 'bg-gray-300 hover:bg-red-400'
          }`}
        />
      ))}
    </div>
    <div className="text-center">
      <Link href="/gallery">
        <button className="bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <T>View More Images</T>
        </button>
      </Link>
    </div>
  </div>
);
