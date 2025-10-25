import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import MainContent from '../components/MainContent';

const Dashboard: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileNavOpen(false); // Close nav when resizing to desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      <Header />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={toggleMobileNav}
            className="w-14 h-14 bg-gradient-to-r from-[#8F3CE2] to-[#2C64E6] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {isMobileNavOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      )}

      <div className="flex pt-20 lg:pt-0">
        {/* Mobile Nav Overlay */}
        {isMobileNavOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeMobileNav}
          />
        )}
        
        {/* Navigator with mobile positioning */}
        <div className={`
          fixed lg:relative top-0 left-0 h-full lg:h-auto z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Navigator onClose={closeMobileNav} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <MainContent />
        </div>
      </div>

      {/* Mobile Nav Spacer */}
      {isMobile && <div className="h-20 lg:h-0"></div>}
    </div>
  );
};

export default Dashboard;