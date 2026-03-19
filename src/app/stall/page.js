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
