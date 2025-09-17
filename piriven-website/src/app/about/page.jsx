'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MobileMenu } from '@/components/MobileMenu';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { FileText, Users, Folder } from 'lucide-react';
import Link from 'next/link';
import T from '@/components/T';

const AboutPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState('Introduction');
  // 🆕 Add state for scroll-based animations
  const [sectionsVisible, setSectionsVisible] = useState({});

  const aboutSections = {
    'Introduction': {
      title: 'Introduction',
      content: (
        <>
          <p><T>The Piriven and Bhikkhu Education program preserves and advances the centuries-old tradition of monastic and Dhamma education in Sri Lanka while equipping learners for life in a modern society. We work with Pirivenas island‑wide to maintain standards, support teachers, enhance curricula, and broaden access for novice monks and lay students alike.</T></p>
          <p><T>Our work spans policy, funding, teacher development, curriculum modernization, examinations, and the coordination of special projects in partnership with provincial and local authorities.</T></p>
          <ul className="list-disc pl-6">
            <li><T>Safeguard the heritage of Buddhist education and values</T></li>
            <li><T>Promote academic excellence and digital literacy</T></li>
            <li><T>Strengthen governance, transparency, and quality assurance</T></li>
            <li><T>Enable community service and cultural leadership</T></li>
          </ul>
        </>
      ),
    },
    'Hon. Minister of Education, Higher Education and Vocational Education': {
      title: 'Hon. Minister',
      content: (
        <>
          <p><T>The Minister provides overall policy direction and stewardship. Under the Minister’s leadership, the program aligns national education goals with the unique mission of Piriven and Dhamma schooling—protecting tradition while preparing students for contemporary opportunities.</T></p>
          <p><T>Key priorities include equitable access, teacher capacity building, and modernization of infrastructure and learning resources.</T></p>
        </>
      ),
    },
    'Hon. Deputy Minister (Education and Higher Education)': {
      title: 'Hon. Deputy Minister (Education)',
      content: (
        <>
          <p><T>Responsible for curriculum development, examinations, accreditation, and coordination with universities and teacher training institutes. The role focuses on academic rigor, learner wellbeing, and smooth progression to higher education pathways.</T></p>
          <ul className="list-disc pl-6">
            <li><T>Curriculum standards and reviews</T></li>
            <li><T>Examination and certification policies</T></li>
            <li><T>Scholarships and student support programs</T></li>
          </ul>
        </>
      ),
    },
    'Hon. Deputy Minister (Vocational Education)': {
      title: 'Hon. Deputy Minister (Vocational Education)',
      content: (
        <>
          <p><T>Leads skills development initiatives and vocational pathways for students, integrating life skills, IT, languages, and employability training into the Piriven framework. Partnerships with industry and TVET bodies expand real‑world learning opportunities.</T></p>
          <ul className="list-disc pl-6">
            <li><T>Vocational curriculum integration and short courses</T></li>
            <li><T>Apprenticeships and community enterprise projects</T></li>
            <li><T>Digital and entrepreneurship skills programs</T></li>
          </ul>
        </>
      ),
    },
    'Secretary': {
      title: 'Secretary',
      content: (
        <>
          <p><T>The Secretary oversees administration, finance, procurement, and implementation. This includes the management of grants to Pirivenas, teacher recruitment and placement, monitoring, and reporting to ensure effective service delivery and accountability.</T></p>
          <ul className="list-disc pl-6">
            <li><T>Budgeting, grants, and resource allocation</T></li>
            <li><T>Teacher management and professional development</T></li>
            <li><T>Monitoring, evaluation, and compliance</T></li>
          </ul>
        </>
      ),
    },
    'Affiliated Institutions': {
      title: 'Affiliated Institutions',
      content: (
        <>
          <p><T>We collaborate with national and provincial bodies to deliver education and community outcomes. Key partners include curriculum and examination authorities, teacher training institutes, and provincial departments of education.</T></p>
          <ul className="list-disc pl-6">
            <li><T>Curriculum and Assessment agencies</T></li>
            <li><T>Teacher Education and Training institutes</T></li>
            <li><T>Provincial and Zonal Education Offices</T></li>
            <li><T>Libraries, museums, and cultural institutions</T></li>
            <li><T>Religious and community organizations</T></li>
          </ul>
        </>
      ),
    },
  };

  const menuItems = Object.keys(aboutSections);

  // 🆕 Add the useEffect hook for IntersectionObserver
  useEffect(() => {
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
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />
      <main className="container mx-auto px-6 py-12 flex-grow flex flex-col md:flex-row gap-8">
        {/* Left Side Menu (for larger screens) */}
        <div 
          id="about-menu"
          data-animate
          className={`md:w-64 flex-shrink-0 transition-all duration-1000 transform ${
            sectionsVisible['about-menu'] 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-10 opacity-0'
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <T>Ministry Overview</T>
            </h2>
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedDoc(item)}
                  className={`relative flex items-center justify-start w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
                    selectedDoc === item
                      ? 'text-red-800 font-extrabold scale-105'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-grow text-left"><T>{item}</T></span>
                  {selectedDoc === item && (
                    <span className="absolute bottom-0 left-0 h-0.5 bg-red-800 w-full animate-underline-grow"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          id="about-content"
          data-animate
          className={`flex-grow transition-all duration-1000 transform ${
            sectionsVisible['about-content'] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up"><T>{aboutSections[selectedDoc].title}</T></h1>
          </div>
          <div className="prose lg:prose-lg text-gray-700 animate-slide-up animation-delay-200">
            {typeof aboutSections[selectedDoc].content === 'string' 
              ? <p><T>{aboutSections[selectedDoc].content}</T></p>
              : aboutSections[selectedDoc].content}
          </div>
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

export default AboutPage;
