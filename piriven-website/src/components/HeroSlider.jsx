import React, { useEffect, useState, useCallback } from 'react';

export const HeroSlider = ({ mainSlides, currentSlide, setCurrentSlide }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (mainSlides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % mainSlides.length);
    }, 17000);
    return () => clearInterval(interval);
  }, [mainSlides.length, setCurrentSlide]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === mainSlides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? mainSlides.length - 1 : currentSlide - 1);
  };

  if (!mainSlides || mainSlides.length === 0) {
    return (
      <section className="relative h-[300px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white/70">No slides yet</div>
      </section>
    );
  }

  return (
    <section 
      className="relative h-[600px] overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Slide Content */}
      {mainSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPrev = index < currentSlide;
        const parallaxX = (mousePosition.x - 0.5) * 10;
        const parallaxY = (mousePosition.y - 0.5) * 10;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isActive 
                ? 'opacity-100 translate-x-0 scale-100' 
                : isPrev
                  ? 'opacity-0 -translate-x-full scale-95' 
                  : 'opacity-0 translate-x-full scale-95'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: isActive ? 10 : 1
            }}
          >
            {/* Background with Subtle Parallax */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
                style={{
                  transform: isActive 
                    ? `translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px) scale(1)` 
                    : 'translate(0px, 0px) scale(1.05)',
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isActive 
                      ? 'brightness(0.75) contrast(1.1)' 
                      : 'brightness(0.6) contrast(0.9)',
                    transition: 'filter 1s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                />
              </div>
            </div>
            
            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0">
              <div className={`absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent transition-opacity duration-1000 ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}></div>
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div 
                  className="max-w-3xl text-white"
                  style={{
                    transform: isActive 
                      ? `translate(${parallaxX * 0.05}px, ${parallaxY * 0.05}px)` 
                      : 'translate(0px, 15px)',
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  
                  {/* Title with Stagger Animation */}
                  <div className="overflow-hidden mb-6">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                      {slide.title.split(' ').map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className={`inline-block mr-4 text-white transition-all duration-1000 ease-out ${
                            isActive 
                              ? 'transform translate-y-0 opacity-100' 
                              : 'transform translate-y-16 opacity-0'
                          }`}
                          style={{
                            transitionDelay: isActive ? `${300 + wordIndex * 100}ms` : '0ms',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </h1>
                  </div>
                  
                  {/* Subtitle */}
                  <div className="overflow-hidden mb-8">
                    <p 
                      className={`text-xl md:text-2xl text-gray-200 leading-relaxed transition-all duration-1000 ease-out ${
                        isActive 
                          ? 'transform translate-y-0 opacity-100' 
                          : 'transform translate-y-12 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isActive ? '500ms' : '0ms',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  {/* Call-to-Action Buttons */}
                  <div className="overflow-hidden">
                    <div 
                      className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out ${
                        isActive 
                          ? 'transform translate-y-0 opacity-100' 
                          : 'transform translate-y-10 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isActive ? '700ms' : '0ms',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {/* Primary Government Button */}
                      <a 
                        href={slide.button_url || '#'}
                        className="group relative inline-block overflow-hidden bg-red-700 hover:bg-red-800 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-out transform focus:outline-none focus:ring-4 focus:ring-red-500/30 hover:shadow-xl hover:shadow-red-900/30 active:scale-95"
                      >
                        {/* Shimmer Effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800"></span>
                        
                        <span className="relative flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                          {slide.button_label || 'Discover More'}
                          <svg 
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Progress Bar */}
      {mainSlides.length > 0 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10 z-20">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300 ease-out"
            style={{ 
              width: `${((currentSlide + 1) / mainSlides.length) * 100}%`,
              boxShadow: '0 0 6px rgba(234, 179, 8, 0.4)'
            }}
          />
        </div>
      )}
      
      {/* Professional Dot Navigation */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 "
        style={{ zIndex: 20 }}
      >
        {mainSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative transition-all duration-400 ease-out transform focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-90 ${
              index === currentSlide 
                ? 'w-10 h-3 bg-yellow-500 rounded-full scale-100' 
                : 'w-3 h-3 bg-white/40 hover:bg-white/70 rounded-full hover:scale-105'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Active indicator glow */}
            {index === currentSlide && (
              <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse opacity-50 "></span>
            )}
          </button>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {mainSlides.length > 1 && (
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 group bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
        style={{ zIndex: 20 }}
      >
        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      )}
      
      {mainSlides.length > 1 && (
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 group bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
        style={{ zIndex: 20 }}
      >
        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      )}

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 text-white/80 font-mono text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10" style={{ zIndex: 20 }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(mainSlides.length).padStart(2, '0')}
      </div>
    </section>
  );
};
