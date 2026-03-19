'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEvents } from '@/utils/eventStorage';
import { getOrgData } from '@/utils/orgStorage';

export default function Home() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    getEvents().then(data => {
      if (data) setEvents(data);
    });

    getOrgData().then(data => {
      if (data) setOrgData(data);
    });

    import('@/utils/storage').then(m => {
      m.getRegistrations().then(regs => {
        if (regs && Array.isArray(regs)) {
          const confirmed = regs.filter(r => r.status === 'confirmed' || r.status === 'verified');
          setAttendees(confirmed);
        }
      });
    });
  }, []);

  return (
    <div className="home-wrapper">
      <nav className="navbar container" style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1200px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', padding: '0.8rem 2rem', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div className="logo" style={{ color: 'var(--color-brand-green)', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Didaar Exhibition</div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="#about" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', transition: 'color 0.3s ease' }}>About</Link>
          <Link href="#schedule" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', transition: 'color 0.3s ease' }}>Schedule</Link>
          <Link href="/admin" title="Admin Access" style={{ opacity: 0.6, display: 'flex', alignItems: 'center', color: '#fff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </Link>
        </div>
      </nav>

      <header className="hero" style={{ height: '90vh', position: 'relative', background: 'url(/hero-bg.png) no-repeat center center/cover', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '100px' }}>
          <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.6rem 1.2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00EA87', marginRight: '10px', boxShadow: '0 0 10px #00EA87' }}></span>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>Registrations Open 2026-27</span>
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', color: '#fff' }}>
              Welcome to <br />
              <span style={{ color: '#00EA87' }}>Didaar Exhibition</span>
            </h1>

            <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.9)', marginBottom: '3rem', maxWidth: '650px', lineHeight: '1.5' }}>
              Smarter Event Management — Empowering Vendors, Visitors & Organizers with Unified Digital Exhibition Solutions.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/guest" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', background: '#007AFF', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(0,122,255,0.4)' }}>
                Explore as Guest <span>→</span>
              </Link>
              <Link href="/stall" className="btn" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.4)', color: '#fff' }}>
                Book a Stall
              </Link>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 3, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 0', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00EA87' }}>15,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Visitors Enrolled</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00EA87' }}>500+</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Local Vendors</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00EA87' }}>50+</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Exhibition Categories</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00EA87' }}>98%</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vendor Success Rate</div>
            </div>
          </div>
        </div>
      </header>

      {orgData && (
        <section id="about" className="section container" style={{ paddingBottom: '8rem', paddingTop: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1rem', color: '#fff', fontSize: '3rem' }}>The Organizers</h2>
            <p style={{ color: 'var(--color-brand-green)', fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto', opacity: 1, fontWeight: '700' }}>
              {orgData.visionStatement || "Leading the pursuit of digital prestige and technical dominance."}
            </p>
          </div>

          {/* Core Representatives */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '6rem', maxWidth: '1000px', margin: '0 auto 6rem' }}>
            {['owner', 'manager', 'company'].map(role => {
              const data = orgData.coreTeam[role];
              if (!data.name && !data.detail && !data.photo) return null;
              return (
                <div key={role} className="glass-panel animate-fade-in" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem', border: '3px solid var(--color-brand-green)', padding: '4px', background: '#000', overflow: 'hidden' }}>
                    <img src={data.photo || 'https://via.placeholder.com/120'} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', filter: 'grayscale(100%)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-brand-green)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontWeight: '800' }}>{data.name || role}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', fontWeight: '700', letterSpacing: '1px' }}>{role.toUpperCase()}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{data.detail || `Dedicated ${role} representation for Didaar Exhibitions.`}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Team Members */}
          {orgData.additionalMembers && orgData.additionalMembers.length > 0 && (
            <>
              <h3 style={{ textAlign: 'center', color: 'var(--color-text-primary)', marginBottom: '3rem', fontSize: '1.5rem' }}>Core Support Team</h3>
              <div className="team-staggered-grid">
                {orgData.additionalMembers.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="team-member-item animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      gridColumn: index % 3 + 1,
                      transform: `translateY(${index % 2 === 0 ? '0' : '30px'})`,
                      marginTop: index < 3 ? '0' : '40px'
                    }}
                  >
                    <div className="member-image-wrapper">
                      <img src={member.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'} alt={member.name} className="member-photo-grayscale" />
                      <div className="member-info-badge">
                        <h3 className="member-name-yellow">{member.name}</h3>
                        <p className="member-role-grey">{member.role}</p>
                      </div>
                      <div className="glow-effect"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <style>{`
            .team-staggered-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 4rem 2rem;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
            }
            
            .team-member-item {
              position: relative;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .member-image-wrapper {
              position: relative;
              width: 100%;
              aspect-ratio: 3/4;
              border-radius: 20px 20px 100px 100px;
              overflow: hidden;
              background: #000;
              box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            }
            
            .member-photo-grayscale {
              width: 100%;
              height: 100%;
              object-fit: cover;
              filter: grayscale(100%) contrast(1.1);
              transition: all 0.6s ease;
              opacity: 0.8;
            }
            
            .team-member-item:hover .member-photo-grayscale {
              filter: grayscale(0%) contrast(1);
              transform: scale(1.05);
              opacity: 1;
            }
            
            .member-info-badge {
              position: absolute;
              top: 15%;
              left: -10%;
              background: rgba(15, 15, 15, 0.85);
              backdrop-filter: blur(10px);
              padding: 0.8rem 1.5rem;
              border-radius: 12px;
              border: 1px solid rgba(230, 184, 0, 0.3);
              z-index: 2;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              min-width: 200px;
            }
            
            .member-name-yellow {
              color: var(--color-gold-main);
              font-size: 0.9rem;
              font-weight: 800;
              letter-spacing: 1.5px;
              margin: 0;
              text-transform: uppercase;
            }
            
            .member-role-grey {
              color: #888;
              font-size: 0.7rem;
              font-weight: 600;
              margin: 0.2rem 0 0 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .glow-effect {
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              background: radial-gradient(circle at center, rgba(230, 184, 0, 0.1) 0%, transparent 70%);
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.5s ease;
            }
            
            .team-member-item:hover .glow-effect {
              opacity: 1;
            }
            
            @media (max-width: 992px) {
              .team-staggered-grid { grid-template-columns: repeat(2, 1fr); }
              .member-info-badge { left: 0; top: 10%; }
            }
            
            @media (max-width: 640px) {
              .team-staggered-grid { grid-template-columns: 1fr; gap: 3rem; }
              .team-member-item { transform: none !important; margin-top: 0 !important; }
            }
          `}</style>
        </section>
      )}

      {attendees.length > 0 && (
        <section id="attendees" className="section container">
          <h2 className="section-title">Who's Attending?</h2>
          <p className="section-text" style={{ marginBottom: '3rem' }}>
            Join {attendees.length} other visionaries who have already secured their spot across all Didaar events.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '850px', margin: '0 auto' }}>
            {attendees.map(guest => {
              const displayName = guest.name || 'Premium Guest';
              const initial = displayName.charAt(0).toUpperCase();
              return (
                <div key={guest.id} className="glass-panel animate-fade-in" style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease', cursor: 'default' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--color-bg-dark)', fontSize: '0.85rem' }}>
                    {initial}
                  </div>
                  <span style={{ fontWeight: '500', color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{displayName}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .home-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--color-text-primary);
          transition: color 0.3s ease;
        }
        .nav-links a:hover {
          color: var(--color-gold-main);
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 5rem;
          background-color: #07070a;
          overflow: hidden;
        }

        .hero::before, .hero::after {
          content: '';
          position: absolute;
          width: 150vw;
          height: 150vh;
          top: -25vh;
          left: -25vw;
          z-index: 0;
          background: radial-gradient(circle at 50% 50%, rgba(230, 184, 0, 0.15) 0%, transparent 40%),
                      radial-gradient(circle at 80% 20%, rgba(120, 50, 255, 0.12) 0%, transparent 35%),
                      radial-gradient(circle at 20% 80%, rgba(0, 200, 255, 0.1) 0%, transparent 35%);
          animation: aurora 25s ease-in-out infinite alternate;
          filter: blur(60px);
        }

        .hero::after {
          background: radial-gradient(circle at 30% 30%, rgba(255, 50, 120, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 70% 80%, rgba(230, 184, 0, 0.12) 0%, transparent 40%);
          animation: aurora 30s ease-in-out infinite alternate-reverse;
          opacity: 0.8;
          mix-blend-mode: screen;
        }

        @keyframes aurora {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.05"/></svg>');
          pointer-events: none;
          z-index: 1;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 4.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
          font-family: var(--font-heading);
          font-weight: 800;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-inline: auto;
        }

        .section {
          padding: 6rem 2rem;
          text-align: center;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }

        .section-text {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .hero-actions { display: flex; flex-direction: column; gap: 1rem; }
          .hero-actions .btn { width: 100%; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
