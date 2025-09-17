import React from 'react';

export const StatCard = ({ stat }) => (
  <div className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10 text-center">
      <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
        {stat.icon}
      </div>
      <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {stat.number}
      </div>
      <div className="text-gray-600 text-sm uppercase tracking-wide font-medium">
        {stat.label}
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);