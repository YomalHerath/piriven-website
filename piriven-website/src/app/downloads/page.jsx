"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainNavigation } from "@/components/MainNavigation";
import { MobileMenu } from "@/components/MobileMenu";
import { Download, FileText, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { fetchDownloadCategories, mediaUrl } from "@/lib/api";

const DownloadsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [categories, setCategories] = useState([]);
  const [sectionsVisible, setSectionsVisible] = useState({});

  const documents = categories.map((c) => c.name);

  // 🆕 Add the useEffect hook for IntersectionObserver
  useEffect(() => {
    // Load categories + publications from API
    (async () => {
      try {
        const data = await fetchDownloadCategories();
        const list = Array.isArray(data) ? data : (data?.results || []);
        setCategories(list);
        if (list.length) setSelectedDoc(list[0].name);
      } catch (e) {
        // keep using fallback
        console.warn('Downloads API not available, using static samples.');
      }
    })();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [selectedDoc]); // Rerun effect when selectedDoc changes to animate new content

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12 flex-grow flex flex-col md:flex-row gap-8">
        {/* Left Side Menu (for larger screens) */}
        <div 
          id="downloads-menu"
          data-animate
          className={`md:w-64 flex-shrink-0 transition-all duration-1000 transform ${
            sectionsVisible['downloads-menu'] 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-10 opacity-0'
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              Documents
            </h2>
            <nav className="flex flex-col space-y-2">
              {documents.map((doc, index) => (
                <button
                  key={doc}
                  onClick={() => setSelectedDoc(doc)}
                  className={`relative flex items-center justify-start w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
                    selectedDoc === doc
                      ? 'text-red-800 font-extrabold scale-105'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-grow text-left">{doc}</span>
                  {selectedDoc === doc && (
                    <span className="absolute bottom-0 left-0 h-0.5 bg-red-800 w-full animate-underline-grow"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Documents Grid Area */}
        <div 
          id="documents-grid-container"
          data-animate
          className={`flex-grow transition-all duration-1000 transform ${
            sectionsVisible['documents-grid-container'] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Section Header */}
          <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">{selectedDoc}</h1>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-500 animate-slide-up animation-delay-200">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1 text-red-800" />
                {(categories.find((c) => c.name === selectedDoc)?.publications?.length || 0)} Documents
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-red-800" />
                Updated Monthly
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {(categories.find((c) => c.name === selectedDoc)?.publications?.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(categories.find((c) => c.name === selectedDoc)?.publications || []).map((pdf, index) => (
                <div 
                  key={pdf.name} 
                  className="group bg-white rounded-lg shadow-lg hover:shadow-lg transition-all duration-500 hover:-translate-y-3 border border-gray-200 hover:border-gray-300 overflow-hidden animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className={`relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden`}>
                    <FileText className="w-24 h-24 text-red-800 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      PDF
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {pdf.size}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-gray-800 leading-tight group-hover:text-red-800 transition-colors duration-300 text-lg">
                      {pdf.title || pdf.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-red-800 flex-shrink-0" />
                        <span>{pdf.date || ''}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-2 text-red-800 flex-shrink-0" />
                        <span>{pdf.department || 'Downloads'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">
                          {pdf.classification || ''}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={pdf.external_url || (pdf.file?.startsWith('/media') ? mediaUrl(pdf.file) : (pdf.url || '#'))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/btn mt-6"
                    >
                      <Download className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                      Download PDF
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="2xl font-bold text-gray-800 mb-4">No Documents Available</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Documents for this category are being prepared. Please check back later for updates.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* 🆕 Add the CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-left {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-right {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes underline-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-underline-grow {
            animation: underline-grow 0.3s ease-in-out forwards;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default DownloadsPage;
