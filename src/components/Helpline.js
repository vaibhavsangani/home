'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Helpline() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not show the helpline on the admin panel
  if (!mounted || (pathname && pathname.startsWith('/admin'))) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
      {isOpen && (
        <div style={{ 
          padding: '1.8rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.02)', 
          backdropFilter: 'blur(30px)', border: '1px solid rgba(255, 255, 255, 0.08)', width: '320px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          animation: 'fade-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>
          <h4 style={{ color: 'var(--color-brand-green)', margin: '0 0 1rem 0', fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.5px' }}>
            <span>🎧</span> 24/7 Support
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6', fontWeight: '500' }}>
            Need assistance with booking or event details? Our Didaar Exhibition support team is here to help!
          </p>
          <a href="tel:+919876543210" style={{ 
            display: 'block', width: '100%', textAlign: 'center', padding: '0.85rem', 
            textDecoration: 'none', marginBottom: '0.75rem', background: 'rgba(0, 234, 135, 0.05)', 
            color: 'var(--color-brand-green)', border: '1px solid rgba(0, 234, 135, 0.2)',
            borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 234, 135, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 234, 135, 0.05)'}
          >
            Direct Call Support
          </a>
          <a href="https://wa.me/919876543210?text=Hi Didaar Exhibition Support, I need some help." target="_blank" rel="noreferrer" style={{ 
            display: 'block', width: '100%', textAlign: 'center', padding: '0.85rem', 
            textDecoration: 'none', background: 'rgba(37, 211, 102, 0.05)', color: '#25D366', 
            border: '1px solid rgba(37, 211, 102, 0.2)', borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s' 
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.05)'}
          >
            WhatsApp Message
          </a>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '70px', height: '70px', borderRadius: '22px', 
          background: 'var(--color-brand-blue)', 
          color: '#fff', border: 'none', cursor: 'pointer', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 15px 35px rgba(0, 122, 255, 0.3)', transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'; e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 122, 255, 0.5)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 122, 255, 0.3)'; }}
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        )}
      </button>
    </div>
  );
}
