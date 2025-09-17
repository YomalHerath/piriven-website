import React from 'react';
import { Calendar } from 'lucide-react';

const noticeItems = [
  {
    title: "විභාග අපේක්ෂකයින්ගේ අනන්‍යතාවය තහවුරු කිරීමේ ක්‍රියාවලිය පිළිබඳ විශේෂ නිවේදනය",
    date: "April 5, 2024",
    image: "/images/notice1.jpg"
  },
];

export const NoticeCard = ({ items }) => {
  const list = items && items.length ? items : noticeItems;
  return (
  <div className="space-y-4">
    {list.map((notice, index) => (
      <div 
        key={index} 
        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
      >
        <div 
          className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
        >
          {notice.image ? (
            <img 
              src={notice.image} 
              alt={notice.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <a href={notice.url || '#'} target={notice.url ? '_blank' : undefined} className="text-gray-700 hover:text-red-800 font-semibold line-clamp-2 transition-colors duration-300">
            {notice.title}
          </a>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {notice.date}
          </p>
        </div>
      </div>
    ))}
  </div>
  );
};
