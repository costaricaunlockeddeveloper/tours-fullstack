"use client"
import { useEffect, useState } from 'react';
import Nav from './Nav';
import Link from 'next/link';
import Image from 'next/image';
export default function Header1({ variant } : any ) {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState<string>("");
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsSticky('cs-gescout_sticky'); // Scrolling down
      } else if (currentScrollPos !== 0) {
        setIsSticky('cs-gescout_show cs-gescout_sticky'); // Scrolling up
      } else {
        setIsSticky('');
      }
      setPrevScrollPos(currentScrollPos); // Update previous scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup the event listener
    };
  }, [prevScrollPos]);

  return (
    <div>
    <header
      className={`cs_site_header header_style_2 header_style_2_0 cs_style_1 header_sticky_style1 ${
        variant ? variant : ''
      } cs_sticky_header cs_site_header_full_width ${
        mobileToggle ? 'cs_mobile_toggle_active' : ''
      } ${isSticky ? isSticky : ''}`}
    >
      <div className="cs_main_header">
        <div className="container-fluid">
          <div className="cs_main_header_in">
            <div className="cs_main_header_left">
            <Link className="cs_site_branding" href="/">
                <Image src="/assets/img/logo/white-logo.svg" alt="img" width={80} height={60}   />
              </Link>
              </div>
              <div className="cs_main_header_center">
                <div className="cs_nav cs_primary_font fw-medium">
                  <span
                    className={
                      mobileToggle
                        ? 'cs-munu_toggle cs-toggle_active'
                        : 'cs-munu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                  <Nav setMobileToggle={setMobileToggle} />
                </div>
            </div>
            <div className="cs_main_header_right">
              <div className="header-btn d-flex align-items-center">
                <div className="main-button header-btn-1 d-flex align-items-center gap-3">
                  <div className="language-switcher-wrap me-2">
                    <button 
                      onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
                      className="language-toggle-btn"
                    >
                      <i className="bi bi-globe2 me-1"></i>
                      <span>{language}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setProfileOpen(!profileOpen)} 
                      className='theme-btn py-2 px-4 min-w-0 header-login-btn d-flex align-items-center gap-2'
                    >
                      <span>Profile</span>
                      <i className={`bi ${profileOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>
                    {profileOpen && (
                      <div className="position-absolute top-100 end-0 mt-2 bg-white rounded shadow-sm py-2" style={{ minWidth: '200px', zIndex: 1000 }}>
                        <Link href="/historical-purchases" className="d-block px-3 py-2 text-dark hover-bg-light text-decoration-none">
                          Historical Purchases
                        </Link>
                      </div>
                    )}
                     {
                      /*
                      <Link href="/login" className='theme-btn py-2 px-4 min-w-0 header-login-btn'>
                    <span>Login</span>
                    </Link>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
}
