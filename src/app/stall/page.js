'use client';

import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveVendor } from '@/utils/vendorStorage';

export default function StallBookingPage() {
  const router = useRouter();
  
  const handleComplete = async (data) => {
    // Add specific meta to mark this as a stall vendor
    data.role = 'vendor';
    data.type = 'stall';
    
    const saved = await saveVendor(data);
    if (saved && saved.id) {
      router.push(`/ticket/${saved.id}`);
    } else {
      alert("Booking Failed! Please try again.");
    }
  };

  return (
    <div className="stall-container animate-fade-in">
      <nav className="navbar container" style={{ padding: '2rem 0' }}>
        <Link href="/" className="logo" style={{ color: 'var(--color-brand-green)', fontWeight: '900', fontSize: '1.5rem' }}>Didaar Exhibition Vendors</Link>
      </nav>

      <div className="form-wrapper">
        <div className="glass-panel main-card" style={{ maxWidth: '800px' }}>
          <div className="step-content">
            <h2 className="step-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', marginBottom: '0.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>
              Vendor Stall Booking
            </h2>
            <p className="text-secondary text-center mb-8" style={{ fontSize: '1.2rem' }}>
              Showcase your brand at building extraordinary experiences. Complete your application below.
            </p>
            
            <RegistrationForm 
              type="stall" 
              ticketType="paid" 
              onComplete={handleComplete} 
            />
          </div>
        </div>
      </div>

      <style>{`
        .stall-container {
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
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 32px;
          padding: 4.5rem;
          width: 100%;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .step-title {
          text-align: center;
          color: #fff;
        }

        .text-secondary {
          color: rgba(255, 255, 255, 0.5);
        }

        .mb-8 { margin-bottom: 2.5rem; }
      `}</style>
    </div>
  );
}
