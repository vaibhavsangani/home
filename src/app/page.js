'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEvents } from '@/utils/eventStorage';
import { getOrgData } from '@/utils/orgStorage';

import { getRegistrations } from '@/utils/storage';
import { getVendors } from '@/utils/vendorStorage';

export default function Home() {
  const [stats, setStats] = useState({ visitors: '15k+', vendors: '500+', cities: '50+', success: '98%' });

  useEffect(() => {
    const loadStats = async () => {
      const regs = await getRegistrations();
      const vndrs = await getVendors();
      const org = await getOrgData();
      
      if (org && org.stats) {
        setStats(org.stats);
      } else {
        setStats({
          visitors: regs.length > 0 ? `${regs.length}+` : '15k+',
          vendors: vndrs.length > 0 ? `${vndrs.length}+` : '500+',
          cities: '50+',
          success: '98%'
        });
      }
    };
    loadStats();
  }, []);
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
      <nav className="navbar container" style={{ position: 'fixed', top: '2rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: '0.8rem 2.5rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div className="logo" style={{ color: '#fff', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.8px' }}>DIDAAR <span style={{color: '#a855f7'}}>EXHIBITION</span></div>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
            <Link href="#about" className="nav-link">Organizers</Link>
            <Link href="#attendees" className="nav-link">Network</Link>
          </div>
        </div>
      </nav>

      <header className="hero-portal">
        <div className="portal-overlay"></div>
        
        <div className="container hero-content">
          <div className="header-text animate-fade-in">
            <h1 className="hero-title">Didaar <span className="text-gradient">Exhibition</span></h1>
            <p className="hero-subtitle">Empowering the future of exhibitions through digital excellence. Your gateway to the Didaar ecosystem.</p>
          </div>

          <div className="portal-grid">
            <Link href="/guest" className="portal-card animate-slide-up">
              <div className="portal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="portal-name">Visitor Portal</h3>
              <p className="portal-desc">Register as a guest and secure your digital entry pass.</p>
              <div className="portal-footer">
                <span className="btn btn-outline w-full">Get Guest Pass</span>
              </div>
            </Link>

            <Link href="/stall" className="portal-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="portal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <h3 className="portal-name">Exhibitor Portal</h3>
              <p className="portal-desc">Book your stall and manage your brand's presence.</p>
              <div className="portal-footer">
                <span className="btn btn-primary w-full">Stall Registration</span>
              </div>
            </Link>

            <Link href="/admin" className="portal-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="portal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <h3 className="portal-name">Admin Portal</h3>
              <p className="portal-desc">Manage events, vendors, and detailed analytics.</p>
              <div className="portal-footer">
                <span className="btn btn-outline w-full">Staff Login</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="stats-bar">
          <div className="container stats-flex">
            <div className="stat-item">
              <span className="stat-num text-gradient">{stats.visitors}</span>
              <span className="stat-label">Visitors</span>
            </div>
            <div className="stat-item">
              <span className="stat-num text-gradient">{stats.vendors}</span>
              <span className="stat-label">Vendors</span>
            </div>
            <div className="stat-item">
              <span className="stat-num text-gradient">{stats.cities}</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="stat-item">
              <span className="stat-num text-gradient">{stats.success}</span>
              <span className="stat-label">Success Rate</span>
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

          <div className="organizers-grid">
            {['owner', 'manager', 'company'].map(role => {
              const data = orgData.coreTeam[role];
              if (!data.name && !data.detail && !data.photo) return null;
              return (
                <div key={role} className="glass-panel organizer-card animate-fade-in">
                  <div className="organizer-image-wrapper">
                    <img src={data.photo || 'https://via.placeholder.com/120'} alt={role} className="organizer-photo" />
                  </div>
                  <h3 className="organizer-name">{data.name || role}</h3>
                  <p className="organizer-role">{role}</p>
                  <p className="organizer-detail">
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
          min-height: 100vh;
          background: var(--color-bg-dark);
          color: var(--color-text-primary);
          font-family: var(--font-body);
        }

        .nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: all 0.3s ease;
        }
        .nav-link:hover { color: #fff; transform: translateY(-1px); }

        .hero-portal {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 8rem;
          overflow: hidden;
        }

        .portal-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.1), transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.1), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.4), var(--color-bg-dark));
          pointer-events: none;
        }

        .hero-title {
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          max-width: 700px;
          margin: 0 auto 5rem;
          line-height: 1.6;
          text-align: center;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .portal-card {
          background: var(--color-bg-panel);
          border: 1px solid var(--color-border);
          padding: 3.5rem 2rem;
          border-radius: 24px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-decoration: none;
          color: #fff;
          position: relative;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .portal-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .portal-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 2.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-brand-blue);
          transition: all 0.4s ease;
        }

        .portal-card:hover .portal-icon {
          background: var(--color-brand-blue);
          color: #fff;
          transform: scale(1.1) rotate(5deg);
        }

        .portal-name {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .portal-desc {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          flex-grow: 1;
        }

        .portal-footer {
          margin-top: auto;
        }

        .stats-bar {
          margin-top: 10rem;
          padding: 4rem 0;
          border-top: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.01);
        }

        .stats-flex {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-num {
          display: block;
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-secondary);
          font-weight: 700;
        }

        /* Organizers Styling */
        .organizers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin: 0 auto 6rem;
          max-width: 1100px;
        }

        .organizer-card {
          padding: 3rem 2rem;
          text-align: center;
          border-radius: 32px;
        }

        .organizer-image-wrapper {
          width: 140px;
          height: 140px;
          margin: 0 auto 2rem;
          padding: 5px;
          border: 2px solid var(--color-brand-blue);
          border-radius: 50%;
          overflow: hidden;
          background: #000;
        }

        .organizer-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          transition: all 0.5s ease;
        }

        .organizer-card:hover .organizer-photo {
          transform: scale(1.1);
        }

        .organizer-name {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .organizer-role {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-brand-blue);
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .organizer-detail {
          font-size: 1rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          font-style: italic;
        }

        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .portal-grid { grid-template-columns: 1fr; max-width: 450px; padding: 0 1.5rem; }
          .hero-title { font-size: 3rem; }
          .stats-flex { flex-wrap: wrap; gap: 3rem; justify-content: center; }
          .stat-item { min-width: 150px; }
        }
      `}</style>
    </div>
  );
}
