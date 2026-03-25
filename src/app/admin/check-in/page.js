'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CheckInPage() {
  const [ticketId, setTicketId] = useState('');
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [stats, setStats] = useState({ visitors: 0, vendors: 0, totalCheckedIn: 0 });
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchStats();
    // Keep input focused for continuous scanning
    const timer = setInterval(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/check-in');
      const data = await res.json();
      if (data && !data.error) setStats(data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!ticketId || loading) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId })
      });

      const result = await res.json();
      
      if (res.ok) {
        setLastCheckIn(result);
        setRecentCheckIns([result, ...recentCheckIns.slice(0, 9)]);
        setTicketId('');
        fetchStats();
        // Clear success message after 3 seconds
        setTimeout(() => setLastCheckIn(null), 3000);
      } else {
        setError(result.error || 'Check-in failed');
        if (result.attendee) setLastCheckIn(result.attendee);
      }
    } catch (err) {
      setError('Network error. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-container animate-fade-in">
      <nav className="navbar container">
        <Link href="/admin" className="logo">Admin Portal</Link>
        <div className="checkin-badge">Live Check-in</div>
      </nav>

      <main className="container main-content">
        <div className="grid-layout">
          {/* Left Side: Scanner Input */}
          <div className="scanner-section">
            <h1 className="main-title">Exhibition Check-in</h1>
            <p className="subtitle">Scan QR Code or Enter Ticket ID manually</p>
            
            <form onSubmit={handleCheckIn} className="scan-form">
              <div className={`input-wrapper ${error ? 'border-error' : lastCheckIn?.success ? 'border-success' : ''}`}>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="ID: TICK-XXXXX"
                  className="id-input"
                  autoFocus
                />
                <button type="submit" disabled={loading} className="btn-scan">
                  {loading ? '...' : 'Check'}
                </button>
              </div>
            </form>

            {error && <div className="alert-error">{error}</div>}
            
            {lastCheckIn && (
              <div className={`checkin-result ${error ? 'result-faded' : 'result-active animate-pop'}`}>
                <div className="result-avatar">
                   {lastCheckIn.name?.charAt(0) || 'G'}
                </div>
                <div className="result-info">
                  <h3>{lastCheckIn.name || 'Guest'}</h3>
                  <p>{lastCheckIn.type?.toUpperCase() || 'ATTENDEE'} PASS</p>
                  <span className="timestamp">
                    {new Date(lastCheckIn.checkInTime).toLocaleTimeString()}
                  </span>
                </div>
                {lastCheckIn.success && <div className="check-mark">✓</div>}
              </div>
            )}
          </div>

          {/* Right Side: Stats & Recent */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <label>Total Entry</label>
                <div className="value">{stats.totalCheckedIn}</div>
              </div>
              <div className="stat-card mini">
                <label>Visitors</label>
                <div className="value">{stats.visitors}</div>
              </div>
              <div className="stat-card mini">
                <label>Vendors</label>
                <div className="value">{stats.vendors}</div>
              </div>
            </div>

            <div className="recent-list-card">
              <h3>Recent Entry Log</h3>
              <div className="recent-list">
                {recentCheckIns.length === 0 ? (
                  <p className="empty-msg">No entries yet today</p>
                ) : (
                  recentCheckIns.map((item, i) => (
                    <div key={i} className="list-item">
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span>{item.type}</span>
                      </div>
                      <div className="item-time">{new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .checkin-container {
          min-height: 100vh;
          background: #050505;
          color: white;
          font-family: inherit;
        }

        .navbar {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
          font-weight: 900;
          font-size: 1.5rem;
          color: #fff;
          text-decoration: none;
        }

        .checkin-badge {
          background: #22c55e;
          color: #000;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .main-content {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 4rem;
        }

        .main-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .input-wrapper {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          padding: 0.5rem;
          height: 4.5rem;
          transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
          border-color: #3b82f6;
          background: rgba(255,255,255,0.05);
        }

        .id-input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          padding: 0 1.5rem;
          flex: 1;
          font-family: monospace;
          letter-spacing: 2px;
        }

        .id-input:focus { outline: none; }

        .btn-scan {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 14px;
          width: 5rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-scan:hover { background: #2563eb; }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .stat-card label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .stat-card .value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .stat-card:first-child { grid-column: span 2; }

        .recent-list-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 2rem;
          height: 400px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .recent-list { overflow-y: auto; flex: 1; margin-top: 1rem; }

        .list-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .item-info strong { display: block; font-size: 0.95rem; }
        .item-info span { font-size: 0.7rem; color: #3b82f6; font-weight: 800; text-transform: uppercase; }
        .item-time { font-size: 0.8rem; color: rgba(255,255,255,0.4); font-weight: 600; }

        .checkin-result {
          margin-top: 4rem;
          background: linear-gradient(135deg, #111, #0a0a0a);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 2.5rem;
          border-radius: 32px;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .result-avatar {
          width: 80px;
          height: 80px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
          color: white;
        }

        .result-info h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.2rem; }
        .result-info p { font-weight: 800; color: #3b82f6; font-size: 0.8rem; letter-spacing: 2px; }
        .timestamp { color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 0.5rem; display: block; }
        .check-mark { font-size: 2.5rem; color: #22c55e; margin-left: auto; }

        .alert-error {
          margin-top: 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 800;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .border-error { border-color: #ef4444 !important; }
        .border-success { border-color: #22c55e !important; }

        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @media (max-width: 1024px) {
          .grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
