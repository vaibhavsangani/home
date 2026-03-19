'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/utils/eventStorage';

export default function RegistrationForm({ type, ticketType, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);

  const stateData = {
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
    'Delhi': ['New Delhi', 'Delhi Cantt', 'Dwarka', 'Rohini'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Dharwad', 'Mangaluru'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  };

  useEffect(() => {
    getEvents().then(data => {
      if (data) setEvents(data);
    });
  }, []);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCities(stateData[state] || []);
  };

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
        <div className="stall-form-sections">
          {/* Section 1: Event Selection */}
          <div className="form-section-card">
            <h3 className="section-title-sm">1. Select Exhibition</h3>
            <div className="form-group">
              <label>Target Event</label>
              <select name="eventId" className="input-field custom-select primary-border" required>
                <option value="">Choose an upcoming event...</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id} style={{background: '#111'}}>{ev.name} • {ev.city} ({new Date(ev.startDate).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="form-section-card">
            <h3 className="section-title-sm">2. Personal Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>First Name*</label>
                <input type="text" name="firstName" className="input-field" placeholder="First Name" required />
              </div>
              <div className="form-group">
                <label>Last Name*</label>
                <input type="text" name="lastName" className="input-field" placeholder="Last Name" required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Phone Number*</label>
                <input type="tel" name="phone" className="input-field" placeholder="+91 ..." required />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="tel" name="whatsapp" className="input-field" placeholder="Same as phone?" />
              </div>
            </div>
            <div className="form-group">
              <label>Business Email*</label>
              <input type="email" name="email" className="input-field" placeholder="contact@business.com" required />
            </div>
          </div>

          {/* Section 3: Business Address */}
          <div className="form-section-card">
            <h3 className="section-title-sm">3. Address Information</h3>
            <div className="form-group">
              <label>Complete Address*</label>
              <textarea name="address" className="input-field" rows="3" placeholder="Shop/Office address..." required></textarea>
            </div>
            <div className="grid-3">
              <div className="form-group">
                <label>State*</label>
                <select name="state" className="input-field custom-select" required onChange={handleStateChange}>
                  <option value="">Select State</option>
                  {Object.keys(stateData).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>City*</label>
                <select name="city" className="input-field custom-select" required disabled={!selectedState}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" className="input-field" placeholder="6 Digits" />
              </div>
            </div>
          </div>

          {/* Section 4: Business Information */}
          <div className="form-section-card">
            <h3 className="section-title-sm">4. Business Details</h3>
            <div className="form-group">
              <label>Company / Brand Name*</label>
              <input type="text" name="companyName" className="input-field" placeholder="e.g. Acme Studio" required />
            </div>
            <div className="form-group">
              <label>Category of Business*</label>
              <input type="text" name="businessCategory" className="input-field" placeholder="Jewelry, Fashion, Food, etc." required />
            </div>
            <div className="form-group">
              <label>Product Details</label>
              <textarea name="productDetails" className="input-field" rows="2" placeholder="Briefly describe your products..."></textarea>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>GST Number</label>
                <input type="text" name="gstNumber" className="input-field" placeholder="Optional" />
              </div>
              <div className="form-group">
                <label>Stall Size Request</label>
                <select name="stallSize" className="input-field custom-select">
                  <option value="2*2">2x2 Meter</option>
                  <option value="2*3">2x3 Meter</option>
                  <option value="3*3">3x3 Meter (Premium)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Documents & ID */}
          <div className="form-section-card">
            <h3 className="section-title-sm">5. Identity & Documents</h3>
            <div className="form-group">
              <label>Aadhar Number*</label>
              <input type="text" name="aadharNumber" className="input-field" placeholder="12 Digit Aadhar" required />
            </div>
            <div className="doc-upload-grid">
              <div className="doc-item">
                <label>Aadhar Card Upload*</label>
                <input type="file" name="aadharCard" className="file-input" required />
              </div>
              <div className="doc-item">
                <label>PAN Card Upload</label>
                <input type="file" name="panCard" className="file-input" />
              </div>
              <div className="doc-item">
                <label>Product Photos</label>
                <input type="file" name="productPhotos" className="file-input" multiple />
              </div>
            </div>
          </div>

          {/* Section 6: Social Media */}
          <div className="form-section-card">
            <h3 className="section-title-sm">6. Social Media & Website</h3>
            <div className="form-group">
              <label>Website URL</label>
              <input type="url" name="website" className="input-field" placeholder="https://..." />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Instagram ID</label>
                <input type="text" name="instagramId" className="input-field" placeholder="@username" />
              </div>
              <div className="form-group">
                <label>Facebook ID</label>
                <input type="text" name="facebookId" className="input-field" placeholder="fb.com/page" />
              </div>
            </div>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the Terms & Conditions and Exhibition Rules</label>
          </div>
        </div>
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
        .form-section-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
        }

        .section-title-sm {
          color: #a855f7; /* Purple vibe */
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        .input-field {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
          background: rgba(0, 0, 0, 0.4);
        }

        .primary-border {
          border-color: rgba(168, 85, 247, 0.4);
        }

        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2em;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .doc-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .file-input {
          width: 100%;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .terms-checkbox {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          height: 4rem;
          border-radius: 15px;
          font-weight: 800;
          font-size: 1.2rem;
          box-shadow: 0 10px 40px rgba(168, 85, 247, 0.4);
          transition: all 0.3s ease;
          color: #fff;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(168, 85, 247, 0.6);
          filter: brightness(1.2);
        }

        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
