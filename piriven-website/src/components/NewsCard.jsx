// components/newsCard.jsx
import React from 'react';
import { Calendar, ExternalLink, ChevronRight } from 'lucide-react';

export const NewsCard = ({ news }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
    <div 
  className="h-48 relative overflow-hidden bg-cover bg-center"
  style={{ backgroundImage: `url(${news.image})` }}
>
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
      <div className="absolute top-4 left-4 bg-black/70 text-white text-center rounded-lg px-3 py-2 backdrop-blur-sm">
        <p className="font-bold text-lg">{news.date.split(' ')[0]}</p>
        <p className="text-xs opacity-90">{news.date.split(' ').slice(1).join(' ')}</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
        {news.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        {news.time}
      </p>
      <button className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center group">
        VIEW DETAIL
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </div>
);