'use client';

import { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import TicketSelector from '@/components/TicketSelector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveRegistration } from '@/utils/storage';

export default function RegisterPage({ searchParams }) {
  const router = useRouter();
  
  const handleComplete = async (data) => {
    // Generate name if missing (invited guests)
    if (!data.name) {
      data.name = 'Invited Guest';
    }
    const saved = await saveRegistration(data);
    if (saved && !saved.error) {
      router.push(`/ticket/${saved.id}`);
    } else {
      alert(saved?.error || "Registration Failed! Please verify your database connection.");
    }
  };

  return (
    <div className="registration-container animate-fade-in">
      <nav className="navbar container" style={{ padding: '2rem 0' }}>
        <Link href="/" className="logo" style={{ color: 'var(--color-brand-green)', fontWeight: '900', fontSize: '1.5rem' }}>Didaar Exhibition</Link>
      </nav>

      <div className="form-wrapper">
        <div className="glass-panel main-card">
          <div className="step-content">
            <h2 className="step-title">
              Registration & Payment
            </h2>
            <div className="ticket-summary-box mb-6" style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              padding: '1.5rem 2rem', 
              borderRadius: '20px', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontWeight: '800' }}>Exhibition Item</p>
                <h3 style={{ color: 'var(--color-brand-green)', fontSize: '1.3rem', margin: 0, fontWeight: '900' }}>Didaar Event Pass</h3>
              </div>
              <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontWeight: '800' }}>Total Amount</p>
                <p style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#fff', fontFamily: 'var(--font-heading)' }}>Rs 49</p>
              </div>
            </div>
            <RegistrationForm 
              type="new" 
              ticketType="paid" 
              onComplete={handleComplete} 
            />
          </div>
        </div>
      </div>

      <style>{`
        .registration-container {
          min-height: 100vh;
          background: radial-gradient(circle at top right, rgba(0, 122, 255, 0.05), #070707 100%);
          display: flex;
          flex-direction: column;
        }

        .form-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 3rem;
          width: 100%;
          max-width: 650px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .step-title {
          margin-bottom: 2rem;
          font-size: 2.2rem;
          font-weight: 900;
          text-align: center;
          letter-spacing: -1px;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .back-btn:hover {
          color: var(--color-brand-blue);
        }

        .success-card {
          text-align: center;
          margin: auto;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 15px var(--color-brand-green));
        }

        .success-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: var(--color-brand-green);
        }

        .success-text {
          color: rgba(255,255,255,0.6);
          margin-bottom: 2.5rem;
          font-size: 1.1rem;
        }

        .qr-placeholder {
          background: #fff;
          padding: 2rem;
          border-radius: 20px;
          display: inline-block;
          margin: 0 auto;
          color: #000;
          box-shadow: 0 0 30px rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
