'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { getRegistrationById } from '@/utils/storage';
import { getEvents } from '@/utils/eventStorage';

export default function TicketPage({ params }) {
  const [ticket, setTicket] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      const resolvedParams = await params;
      const data = await getRegistrationById(resolvedParams.id);
      const events = await getEvents();
      
      setTicket(data);
      
      let matchedEvent = null;
      if (data && data.eventId && events.length > 0) {
        matchedEvent = events.find(e => e.id === data.eventId);
      }
      if (!matchedEvent && events.length > 0) {
        matchedEvent = events[0];
      }

      setEventDetails(matchedEvent || { name: 'Didaar Exhibition', venue: 'Grand Expo Hall', city: 'Mumbai', startDate: '2026-10-15', endDate: '2026-10-18' });
      setLoading(false);
    };
    loadTicket();
  }, [params]);

  if (loading) {
    return (
      <div className="ticket-container animate-fade-in flex-center">
        <div className="loader"></div>
        <style>{`.flex-center { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #050505; } .loader { border: 4px solid rgba(255,255,255,0.05); border-top-color: var(--color-brand-green); border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; filter: drop-shadow(0 0 10px var(--color-brand-green)); } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-container animate-fade-in flex-center flex-col">
        <h2 className="text-2xl mb-4">Ticket Not Found</h2>
        <Link href="/" className="btn btn-outline">Return Home</Link>
        <style>{`.flex-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--color-bg-dark); color: white; }`}</style>
      </div>
    );
  }

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="ticket-container animate-fade-in">
      <nav className="navbar container" style={{ padding: '2rem 0' }}>
        <Link href="/" className="logo" style={{ color: 'var(--color-brand-green)', fontWeight: '900', fontSize: '1.5rem' }}>Didaar Exhibition</Link>
        <button onClick={handleDownload} className="btn btn-outline print-hidden" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          Download Ticket
        </button>
      </nav>

      <main className="ticket-main container">
        <div className="ticket-card glass-panel">
          <div className="ticket-header">
            <div className="event-brand">
              <span className="brand-logo">{eventDetails.name}</span>
              <span className="brand-subtitle">{eventDetails.city} - {new Date(eventDetails.startDate).getFullYear()}</span>
            </div>
            <div className={`ticket-badge ${ticket.ticketType === 'paid' ? 'badge-paid' : 'badge-free'}`}>
              {ticket.ticketType.toUpperCase()} PASS
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-info">
              <div className="info-group">
                <label>Attendee</label>
                <p className="attendee-name">{ticket.name || 'Guest'}</p>
                <p className="attendee-email">{ticket.email}</p>
              </div>
              
              <div className="info-row">
                <div className="info-group">
                  <label>Date</label>
                  <p>{new Date(eventDetails.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - {new Date(eventDetails.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</p>
                </div>
                <div className="info-group">
                  <label>Venue</label>
                  <p>{eventDetails.venue}</p>
                </div>
              </div>

              <div className="info-group mt-4">
                <label>Ticket ID</label>
                <p className="ticket-id">{ticket.id}</p>
              </div>
            </div>

            <div className="ticket-qr-section">
              <div className="qr-wrapper">
                <QRCodeSVG 
                  value={ticket.id} 
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  includeMargin={false}
                />
              </div>
              <p className="qr-hint">Scan at entrance</p>
            </div>
          </div>
          
          <div className="ticket-footer text-secondary text-sm">
            Valid for one entry only. Non-transferable.
          </div>
        </div>
      </main>

      <style>{`
        .ticket-container {
          min-height: 100vh;
          background: radial-gradient(circle at top center, rgba(0, 122, 255, 0.05), #070707 100%);
          display: flex;
          flex-direction: column;
        }

        .ticket-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .ticket-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 32px;
          width: 100%;
          max-width: 750px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          position: relative;
        }

        /* Decorative cutouts */
        .ticket-card::before, .ticket-card::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 44px;
          height: 44px;
          background: #070707;
          border-radius: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }
        .ticket-card::before { left: -22px; border-right: 1px solid rgba(255,255,255,0.05); }
        .ticket-card::after { right: -22px; border-left: 1px solid rgba(255,255,255,0.05); }

        .ticket-header {
          padding: 3rem 4rem;
          border-bottom: 2px dashed rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.01);
        }

        .brand-logo {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--color-brand-green);
          line-height: 1;
          letter-spacing: -1px;
        }
        .brand-subtitle {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 0.5rem;
          font-weight: 800;
        }

        .ticket-badge {
          padding: 0.6rem 1.8rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 2px;
        }
        .badge-paid {
          background: var(--color-brand-green);
          color: #000;
        }
        .badge-free {
          background: rgba(0, 122, 255, 0.1);
          color: var(--color-brand-blue);
          border: 1px solid rgba(0, 122, 255, 0.2);
        }

        .ticket-body {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4rem;
          padding: 4rem;
        }

        .ticket-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-group label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-brand-blue);
          margin-bottom: 0.5rem;
          font-weight: 900;
        }
        .attendee-name {
          font-size: 2.2rem !important;
          font-weight: 900 !important;
          font-family: var(--font-heading);
          color: #fff;
          letter-spacing: -1px;
        }
        .attendee-email {
          font-size: 1.1rem !important;
          color: rgba(255,255,255,0.5);
          margin-top: 0.25rem;
        }
        .ticket-id {
          font-family: monospace;
          background: rgba(255,255,255,0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          display: inline-block;
          letter-spacing: 1px;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .info-row {
          display: flex;
          gap: 4rem;
        }

        .ticket-qr-section {
          background: rgba(255,255,255,0.02);
          padding: 2.5rem;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .qr-wrapper {
          background: white;
          padding: 1.25rem;
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(255,255,255,0.1);
        }
        
        .qr-hint {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .ticket-footer {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          letter-spacing: 1px;
        }

        @media (max-width: 640px) {
          .ticket-body {
            grid-template-columns: 1fr;
          }
          .ticket-qr-section {
            margin-top: 1rem;
          }
          .info-row {
            gap: 1.5rem;
          }
        }

        /* Print Layout */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-hidden {
            display: none !important;
          }
          .ticket-card, .ticket-card * {
            visibility: visible;
          }
          .ticket-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: none;
            border: 2px solid #000;
            background: #fff;
            color: #000;
            width: 100%;
            max-width: 800px;
          }
          .ticket-card::before, .ticket-card::after {
            display: none;
          }
          .info-group label, .brand-logo, .brand-subtitle, .attendee-email {
            color: #333 !important;
          }
          .attendee-name {
            color: #000 !important;
          }
          .ticket-badge.badge-free {
            border-color: #000;
            color: #000;
          }
          .ticket-id {
            background: #f0f0f0;
            color: #000;
          }
        }
      `}</style>
    </div>
  );
}
