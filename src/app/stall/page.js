'use client';

import { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveVendor } from '@/utils/vendorStorage';

export default function StallBookingPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const handleComplete = async (data) => {
    // Add specific meta to mark this as a stall vendor
    data.role = 'vendor';
    data.type = 'stall';
    
    const saved = await saveVendor(data);
    if (saved && !saved.error) {
      setVendorId(saved.id);
      setCompanyName(data.companyName);
      setSubmitted(true);
    } else {
      alert(saved?.error || "Booking Failed! Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="stall-container success-state animate-fade-in">
        <div className="success-content container text-center">
          <div className="success-icon mb-8">
            <div className="check-circle shadow-glow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <h1 className="success-title">Registration Successful</h1>
          <p className="success-subtitle mb-8">
            Thank you for registering with <strong>Didaar Exhibition</strong>.<br/>
            Your application for <strong>{companyName}</strong> has been received.
          </p>
          
          <div className="info-card mb-12">
            <div className="info-item">
              <span className="label">Reference ID</span>
              <span className="value">{vendorId}</span>
            </div>
            <div className="info-item">
              <span className="label">Status</span>
              <span className="value status-pending">Pending Verification</span>
            </div>
          </div>

          <div className="action-buttons">
            <Link href={`/ticket/${vendorId}`} className="btn-success-primary">
              View Digital Pass
            </Link>
            <Link href="/" className="btn-success-secondary">
              Back to Home
            </Link>
          </div>
          
          <p className="footer-note mt-8">
            A confirmation email has been sent to your registered address.
          </p>
        </div>

        <style jsx>{`
          .success-state {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4rem 1rem;
          }
          .check-circle {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            color: white;
            padding: 25px;
          }
          .shadow-glow {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
          }
          .success-title {
            font-size: 3.5rem;
            font-weight: 900;
            letter-spacing: -2px;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .success-subtitle {
            font-size: 1.4rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
          }
          .info-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 2.5rem;
            max-width: 500px;
            margin: 0 auto 3rem;
            display: grid;
            gap: 2rem;
          }
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .label {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.4);
            font-weight: 700;
          }
          .value {
            font-size: 1.8rem;
            font-weight: 800;
            color: #fff;
          }
          .status-pending {
            color: #fbbf24;
            font-size: 1.2rem;
          }
          .action-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
          }
          .btn-success-primary {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            padding: 1.2rem 2.5rem;
            border-radius: 16px;
            font-weight: 800;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
          }
          .btn-success-secondary {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.2rem 2.5rem;
            border-radius: 16px;
            font-weight: 800;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
          }
          .btn-success-primary:hover { transform: translateY(-3px); filter: brightness(1.2); }
          .btn-success-secondary:hover { background: rgba(255, 255, 255, 0.1); }
          .footer-note {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="stall-container animate-fade-in">
      <nav className="navbar container" style={{ padding: '2rem 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Link href="/" className="logo" style={{ color: '#fff', fontWeight: '900', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>DIDAAR <span style={{color: '#a855f7'}}>EXHIBITOR</span></Link>
      </nav>

      <div className="form-wrapper">
        <div className="form-inner container" style={{ maxWidth: '900px', width: '100%', padding: '6rem 1rem 4rem' }}>
          <div className="header-content text-center mb-12">
            <h1 className="main-title">Exhibitor Registration</h1>
            <p className="subtitle">Join our upcoming luxury exhibitions. Fill in your professional and business details below.</p>
          </div>
          
          <RegistrationForm 
            type="stall" 
            ticketType="paid" 
            onComplete={handleComplete} 
          />
        </div>
      </div>

      <style>{`
        .stall-container {
          min-height: 100vh;
          background: #0a0a0c;
          background-image: 
            radial-gradient(at 0% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.15) 0px, transparent 50%);
          color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .form-wrapper {
          display: flex;
          justify-content: center;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -2px;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.5);
          max-width: 600px;
          margin: 0 auto;
        }

        .mb-12 { margin-bottom: 4rem; }
      `}</style>
    </div>
  );
}
