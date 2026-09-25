import { useState, useEffect } from 'react';
import { Bell, User, ChevronRight, X, Menu, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { id: 'home', label: 'Product' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'trips', label: 'My Trips' },
  { id: 'group', label: 'Group' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'suraksha', label: 'Suraksha' },
];

/* SVG logo mark — path + compass node */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 26 Q6 18 16 16 Q26 14 26 6" stroke="#F28A28" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="6" cy="26" r="3" fill="#F28A28" />
      <circle cx="26" cy="6" r="5.5" fill="#F28A28" />
      <path d="M26 3.5 L27.2 5.8 L26 5.2 L24.8 5.8 Z" fill="white" />
      <path d="M26 8.5 L24.8 6.2 L26 6.8 L27.2 6.2 Z" fill="white" opacity="0.6" />
      <path d="M23.5 6 L25.8 4.8 L25.2 6 L25.8 7.2 Z" fill="white" opacity="0.6" />
      <path d="M28.5 6 L26.2 7.2 L26.8 6 L26.2 4.8 Z" fill="white" />
      <circle cx="16" cy="16" r="2.5" fill="white" stroke="#F28A28" strokeWidth="2" />
    </svg>
  );
}

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 transition-all"
        style={{
          background: scrolled ? 'rgba(247,245,236,0.97)' : 'rgba(247,245,236,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #E3E2D7' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-8">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 flex-shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <LogoMark size={30} />
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#1B211C', letterSpacing: '-0.01em' }}>
              YatraSarthi
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: activePage === link.id ? '#1B211C' : '#6F756C',
                  fontWeight: activePage === link.id ? 600 : 500,
                  borderBottom: activePage === link.id ? '2px solid #F28A28' : '2px solid transparent',
                  borderRadius: 0,
                  paddingBottom: 6,
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button className="btn-ghost relative" style={{ padding: '8px 10px' }} title="2 Active Notifications">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#E45B4D' }} />
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="btn-ghost flex items-center gap-1.5 transition-all" 
              style={{ 
                padding: '6px 12px',
                background: activePage === 'dashboard' ? 'rgba(242,138,40,0.12)' : 'transparent',
                color: activePage === 'dashboard' ? '#F28A28' : '#6F756C',
                border: activePage === 'dashboard' ? '1px solid rgba(242,138,40,0.25)' : '1px solid transparent',
                borderRadius: '10px'
              }}
              title="Go to User Dashboard"
            >
              <User size={16} />
              <span className="text-xs font-bold">Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('new-trip')}
              className="btn-primary text-sm px-4 py-2"
            >
              Plan a trip
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile right */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="btn-ghost" 
              style={{ 
                padding: '8px 10px',
                color: activePage === 'dashboard' ? '#F28A28' : '#6F756C'
              }}
              title="User Dashboard"
            >
              <User size={18} />
            </button>
            <button className="btn-ghost relative" style={{ padding: '8px 10px' }}>
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#E45B4D' }} />
            </button>
            <button onClick={() => setDrawerOpen(true)} className="btn-ghost" style={{ padding: '8px 10px' }}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{ width: 300, background: '#F7F5EC', borderLeft: '1px solid #E3E2D7', transform: 'translateX(0)', animation: 'slide-up 0.2s ease' }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#E3E2D7' }}>
              <div className="flex items-center gap-2">
                <LogoMark size={24} />
                <span className="font-bold" style={{ color: '#1B211C' }}>YatraSarthi</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="btn-ghost" style={{ padding: '6px 8px' }}>
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setDrawerOpen(false); }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                  style={{
                    background: activePage === link.id ? 'rgba(242,138,40,0.08)' : 'transparent',
                    color: activePage === link.id ? '#F28A28' : '#1B211C',
                    fontWeight: activePage === link.id ? 600 : 500,
                  }}
                >
                  {link.label}
                  <ChevronRight size={14} style={{ color: '#6F756C', opacity: activePage === link.id ? 1 : 0 }} />
                </button>
              ))}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: '#E3E2D7' }}>
              <button
                onClick={() => { onNavigate('new-trip'); setDrawerOpen(false); }}
                className="btn-primary w-full py-3 text-sm"
              >
                Plan a trip <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
