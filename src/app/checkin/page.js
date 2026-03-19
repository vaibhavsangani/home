'use client';

import { useState } from 'react';
import { getRegistrationById, updateRegistrationStatus } from '@/utils/storage';
import Link from 'next/link';

export default function CheckinPage() {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [ticketData, setTicketData] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ticketId) return;

    const idToSearch = ticketId.trim().toUpperCase();
    const ticket = await getRegistrationById(idToSearch);

    if (ticket) {
      if (ticket.status === 'checked-in') {
        setStatus('error');
        setMessage('Ticket already checked in!');
      } else {
        await updateRegistrationStatus(ticket.id, 'checked-in');
        setStatus('success');
        setMessage('Valid Ticket! Entry Approved.');
      }
      setTicketData(ticket);
    } else {
      setStatus('error');
      setMessage('Invalid Ticket ID. Not found.');
      setTicketData(null);
    }
  };

  const handleReset = () => {
    setTicketId('');
    setStatus(null);
    setMessage('');
    setTicketData(null);
  };

  return (
    <div className="checkin-container animate-fade-in">
      <nav className="navbar container justify-between" style={{ padding: '2rem 0' }}>
        <Link href="/" className="logo" style={{ color: 'var(--color-brand-green)', fontWeight: '900', fontSize: '1.5rem' }}>Didaar Exhibition</Link>
        <span className="text-secondary text-sm" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', opacity: '0.6' }}>Staff Portal</span>
      </nav>

      <main className="checkin-main">
        <div className="checkin-card glass-panel">
          <div className="scanner-header">
            <h2>Ticket Scanner</h2>
            <p className="text-secondary">Enter Ticket ID or use scanner device</p>
          </div>

          {!status ? (
            <form className="scanner-form" onSubmit={handleScan}>
              <div className="scanner-input-group">
                <input 
                  type="text" 
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="e.g. TKT-12345"
                  className="scanner-input"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-scan">
                  Verify
                </button>
              </div>
              
              <div className="camera-sim">
                <div className="scan-line"></div>
                <p>Camera Scanner (Coming Soon)</p>
              </div>
            </form>
          ) : (
            <div className={`result-view ${status}`}>
              <div className="result-icon">
                {status === 'success' ? '✅' : '❌'}
              </div>
              <h3 className="result-message">{message}</h3>
              
              {ticketData && (
                <div className="ticket-summary">
                  <p><strong>Name:</strong> {ticketData.name || 'Guest'}</p>
                  <p><strong>Type:</strong> <span style={{ textTransform: 'uppercase'}}>{ticketData.ticketType} Pass</span></p>
                  <p><strong>Registration:</strong> {ticketData.type}</p>
                </div>
              )}

              <button onClick={handleReset} className="btn btn-outline btn-next">
                Scan Next Ticket
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .checkin-container {
          min-height: 100vh;
          background-color: #0a0a0a;
          display: flex;
          flex-direction: column;
        }

        .justify-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkin-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .checkin-card {
          width: 100%;
          max-width: 500px;
          padding: 3rem 2rem;
          text-align: center;
        }

        .scanner-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
          font-weight: 900;
          letter-spacing: -1px;
        }
        
        .scanner-header p {
          margin-bottom: 2rem;
        }

        .scanner-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .scanner-input-group {
          display: flex;
          gap: 1rem;
        }

        .scanner-input {
          flex: 1;
          background: rgba(0,0,0,0.5);
          border: 1px solid var(--color-border);
          padding: 1rem;
          border-radius: 12px;
          color: white;
          font-family: monospace;
          font-size: 1.25rem;
          text-align: center;
          text-transform: uppercase;
        }
        .scanner-input:focus {
          outline: none;
          border-color: var(--color-brand-blue);
          box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
        }

        .btn-scan {
          padding: 0 2rem;
        }

        .camera-sim {
          height: 200px;
          background: rgba(255,255,255,0.02);
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          position: relative;
          overflow: hidden;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: var(--color-brand-green);
          box-shadow: 0 0 15px var(--color-brand-green);
          animation: scan 2s infinite linear;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }

        .result-view {
          padding: 2rem 0;
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .result-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
        }

        .result-message {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .result-view.success .result-message {
          color: var(--color-success);
        }
        
        .result-view.error .result-message {
          color: #ff4d4f;
        }

        .ticket-summary {
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: left;
          margin-bottom: 2rem;
        }

        .ticket-summary p {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .btn-next {
          width: 100%;
        }

        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
