'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEvents } from '@/utils/eventStorage';
import RegistrationForm from '@/components/RegistrationForm';
import { saveRegistration } from '@/utils/storage';
import { useRouter } from 'next/navigation';

export default function GuestDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getEvents().then(data => {
      if (data) setEvents(data);
    });
  }, []);

  return (
    <div className="admin-layout">
      <nav className="sidebar glass-panel" style={{ background: 'rgba(255,255,255,0.01)', borderRight: '1px solid var(--color-border)' }}>
        <div className="logo mb-8" style={{ color: 'var(--color-brand-green)', fontWeight: '900' }}>Didaar Exhibition</div>
        <ul className="nav-list">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li className={`nav-item ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => setActiveTab('booking')}>Ticket Booking</li>
          <li className={`nav-item ${activeTab === 'event' ? 'active' : ''}`} onClick={() => setActiveTab('event')}>Events & Schedule</li>
        </ul>
        <Link href="/" className="exit-link" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>← Return to Site</Link>
      </nav>

      <main className="main-content">
        <header className="admin-header glass-panel mb-8">
          <h1 className="text-2xl font-bold">
            {activeTab === 'dashboard' && 'Welcome to Didaar'}
            {activeTab === 'booking' && 'Reserve Your Spot'}
            {activeTab === 'event' && 'Event Details'}
          </h1>
          <div className="admin-status">
            <span className="status-dot"></span> Web Portal
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <section className="stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
            <div className="stat-card glass-panel" style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '32px' }}>
              <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1.5rem' }}>✨</span>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px' }}>
                 {events.length > 0 ? events[0].name : "Didaar Exhibition"}
              </h2>
              <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                Join us for exclusive showcases of art, innovation, and culture across multiple spectacular venues. Experience the extraordinary.
              </p>
              <button className="btn btn-primary mt-8" onClick={() => setActiveTab('booking')} style={{ padding: '1.2rem 4rem', background: 'var(--color-brand-blue)', borderRadius: '14px', fontSize: '1.1rem' }}>
                View & Book Tickets
              </button>
            </div>
          </section>
        )}

        {activeTab === 'booking' && (
          <section className="booking-section animate-fade-in" style={{ maxWidth: '700px' }}>
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
               <h2 style={{ fontSize: '2.2rem', marginBottom: '2.5rem', color: '#fff', fontWeight: '900', letterSpacing: '-1px' }}>Secure Your Pass</h2>
               <RegistrationForm 
                type="new" 
                ticketType="paid" 
                onComplete={async (data) => {
                  const saved = await saveRegistration(data);
                  if (saved && saved.id) {
                    router.push(`/ticket/${saved.id}`);
                  } else {
                    alert('An error occurred while booking your ticket. Please try again.');
                  }
                }} 
              />
            </div>
          </section>
        )}

        {activeTab === 'event' && (
          <section className="event-section animate-fade-in" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {events.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '24px' }}>
                <p className="text-secondary" style={{ fontSize: '1.2rem' }}>No upcoming events scheduled currently. Stay tuned!</p>
              </div>
            ) : events.map(ev => (
              <div key={ev.id} className="premium-event-card">
                <div className="event-card-accent"></div>
                <div className="event-card-header">
                  <div className="event-badge">Upcoming Exhibition</div>
                  <h3 className="event-title">{ev.name}</h3>
                </div>
                
                <div className="event-grid">
                  <div className="event-detail-box">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Location</span>
                      <strong className="detail-primary">{ev.venue}</strong>
                      <span className="detail-secondary">{ev.city}</span>
                    </div>
                  </div>

                  <div className="event-detail-box">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Schedule</span>
                      <strong className="detail-primary">
                        {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                      </strong>
                      <span className="detail-secondary">
                        Until {new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="event-card-footer">
                  <button className="btn-premium" onClick={() => setActiveTab('booking')}>
                    <span>Reserve Ticket for {ev.name}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

      </main>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background-color: #050505; }
        .sidebar { width: 300px; padding: 2.5rem 2rem; border-right: 1px solid var(--color-border); display: flex; flex-direction: column; }
        .logo { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; letter-spacing: -0.5px; }
        .nav-list { list-style: none; padding: 0; margin: 0; flex-grow: 1; }
        .nav-item { padding: 1rem 1.5rem; margin-bottom: 0.5rem; border-radius: 12px; cursor: pointer; color: rgba(255,255,255,0.5); transition: all 0.2s ease; font-weight: 600; font-size: 0.95rem; }
        .nav-item:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
        .nav-item.active { color: var(--color-brand-blue); background: rgba(0, 122, 255, 0.1); border-left: 3px solid var(--color-brand-blue); border-radius: 0 12px 12px 0; }
        .exit-link { color: rgba(255,255,255,0.4); text-decoration: none; padding: 1rem; transition: color 0.2s; display: block; text-align: center; font-size: 0.9rem; }
        .exit-link:hover { color: #fff; }
        
        .main-content { flex-grow: 1; padding: 3rem 5rem; overflow-y: auto; background: radial-gradient(circle at top right, rgba(0, 122, 255, 0.03), transparent); }
        .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-radius: 20px; border: 1px solid var(--color-border); background: rgba(255,255,255,0.01) !important; }
        .admin-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; background-color: #00EA87; box-shadow: 0 0 12px #00EA87; }
        
        /* Premium Event Card Styles */
        .premium-event-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .premium-event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          border-color: rgba(0, 122, 255, 0.2);
        }
        .event-card-accent {
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, transparent, var(--color-brand-blue), transparent);
        }
        .event-card-header {
          padding: 3rem 4rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .event-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(0, 122, 255, 0.1);
          color: var(--color-brand-blue);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(0, 122, 255, 0.2);
        }
        .event-title {
          font-size: 2.8rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1.5px;
        }
        .event-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 3.5rem 4rem;
        }
        .event-detail-box {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }
        .detail-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(0, 122, 255, 0.05);
          color: var(--color-brand-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 122, 255, 0.1);
        }
        .detail-primary {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }
        .detail-secondary {
          font-size: 1rem;
          color: rgba(255,255,255,0.4);
        }
        .event-card-footer {
          padding: 2.5rem 4rem;
          background: rgba(255,255,255,0.01);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .btn-premium {
          width: 100%;
          padding: 1.5rem;
          background: var(--color-brand-blue);
          color: #fff;
          font-size: 1.15rem;
          font-weight: 800;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        }
        .btn-premium:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.5);
          filter: brightness(1.1);
        }
        @media (max-width: 640px) {
          .event-grid { grid-template-columns: 1fr; gap: 1.75rem; padding: 1.5rem; }
          .event-card-header { padding: 1.5rem; }
          .event-card-footer { padding: 1.5rem; }
          .event-title { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
