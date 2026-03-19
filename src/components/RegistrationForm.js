'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/utils/eventStorage';

export default function RegistrationForm({ type, ticketType, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(data => {
      if (data) setEvents(data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Add type and ticketType explicitly as they are props not inputs
    data.type = type;
    data.ticketType = ticketType;

    // Simulate API call / Payment gateway processing
    setTimeout(() => {
      setLoading(false);
      onComplete(data);
    }, 1500);
  };

  return (
    <form className="animate-fade-in" onSubmit={handleSubmit}>
      {type === 'stall' ? (
        <>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Select Exhibition Event</label>
            <select name="eventId" className="input-field custom-select" required style={{ border: '1px solid var(--color-brand-blue)', background: 'rgba(0,122,255,0.05)' }}>
              {events.map(ev => (
                <option key={ev.id} value={ev.id} style={{background: '#111'}}>{ev.name} • {ev.city} ({new Date(ev.startDate).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Company / Brand Name</label>
            <input type="text" name="companyName" className="input-field" placeholder="e.g. Acme Creative Studio" required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Contact Person Name</label>
            <input type="text" name="name" className="input-field" placeholder="John Doe" required />
          </div>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group mb-0">
              <label>Business Email</label>
              <input type="email" name="email" className="input-field" placeholder="contact@brand.com" required />
            </div>
            <div className="form-group mb-0">
              <label>Phone Number</label>
              <input type="tel" name="phone" className="input-field" placeholder="+1..." required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group mb-0">
              <label>Industry Category</label>
              <input type="text" name="category" className="input-field" placeholder="e.g. Handmade Crafts" required />
            </div>
            <div className="form-group mb-0">
              <label>GST Number (Optional)</label>
              <input type="text" name="gstNumber" className="input-field" placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>Booth Size</label>
            <select name="stallSize" className="input-field custom-select" required>
              <option value="2*2">2x2 Meter</option>
              <option value="2*3">2x3 Meter</option>
              <option value="2*4">2x4 Meter</option>
              <option value="1*3">1x3 Meter</option>
              <option value="3*3">3x3 Meter</option>
            </select>
          </div>
        </>
      ) : type === 'new' ? (
        <>
          <div className="form-group">
            <label>Select Exhibition Event</label>
            <select name="eventId" className="input-field custom-select" required style={{ border: '1px solid var(--color-brand-blue)', background: 'rgba(0,122,255,0.05)' }}>
              {events.map(ev => (
                <option key={ev.id} value={ev.id} style={{background: '#111'}}>{ev.name} • {ev.city} ({new Date(ev.startDate).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="input-field" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="input-field" placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" className="input-field" placeholder="+1..." required />
          </div>
        </>
      ) : (
        <>
          <p className="invite-desc">
            Please enter the email address or phone number where you received your invitation.
          </p>
          <div className="form-group mt-4">
            <label>Email or Phone</label>
            <input type="text" name="email" className="input-field" placeholder="Enter your invite detail..." required />
          </div>
          <div className="form-group">
            <label>Invitation Code (Optional)</label>
            <input type="text" className="input-field" placeholder="e.g. DIDAAR-2026" />
          </div>
        </>
      )}



      <button 
        type="submit" 
        className="btn btn-primary w-full mt-6 submit-btn"
        disabled={loading}
      >
        {loading ? 'Processing...' : type === 'stall' ? 'Submit Stall Request' : 'Complete Registration'}
      </button>

      <style>{`
        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          padding: 0.85rem 1.2rem;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--color-brand-blue);
          box-shadow: 0 0 15px rgba(0, 122, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .invite-desc {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23007AFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2em;
        }

        .submit-btn {
          height: 3.8rem;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 2rem;
          background: var(--color-brand-blue);
          box-shadow: 0 8px 30px rgba(0, 122, 255, 0.4);
          border-radius: 12px;
          color: #fff;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0, 122, 255, 0.6);
          filter: brightness(1.1);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
