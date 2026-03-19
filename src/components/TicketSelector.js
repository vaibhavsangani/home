'use client';

export default function TicketSelector({ selected, onSelect }) {
  return (
    <div className="ticket-cards">
      <div 
        className={`ticket-card ${selected === 'free' ? 'selected' : ''}`}
        onClick={() => onSelect('free')}
      >
        <div className="ticket-type" style={{ color: 'var(--color-brand-green)' }}>General Admission</div>
        <div className="ticket-price">Free</div>
        <ul className="ticket-features">
          <li>Access to Main Exhibition Hall</li>
          <li>Network with Creators</li>
          <li>Digital Art Gallery</li>
        </ul>
      </div>

      <div 
        className={`ticket-card ${selected === 'paid' ? 'selected' : ''}`}
        onClick={() => onSelect('paid')}
      >
        <div className="ticket-badge">TOP RATED</div>
        <div className="ticket-type" style={{ color: 'var(--color-brand-green)' }}>Premium Pass</div>
        <div className="ticket-price">Rs 49</div>
        <ul className="ticket-features">
          <li>All General Admission Perks</li>
          <li>Exclusive Opening Night Access</li>
          <li>Complimentary Drinks</li>
          <li>Guided Curator Tour</li>
        </ul>
      </div>

      <style>{`
        .ticket-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .ticket-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .ticket-card:hover {
          border-color: rgba(0, 234, 135, 0.2);
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .ticket-card.selected {
          border-color: var(--color-brand-blue);
          background: rgba(0, 122, 255, 0.05);
          box-shadow: 0 0 30px rgba(0, 122, 255, 0.2);
        }

        .ticket-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--color-brand-blue);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.5rem 1.2rem;
          border-radius: 0 0 0 16px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .ticket-type {
          font-size: 1.4rem;
          font-weight: 900;
          margin-bottom: 0.75rem;
          letter-spacing: -0.5px;
        }

        .ticket-price {
          font-size: 3.2rem;
          font-weight: 900;
          margin-bottom: 2rem;
          color: #fff;
          font-family: var(--font-heading);
          letter-spacing: -2px;
        }

        .ticket-features {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.5rem;
        }

        .ticket-features li {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .ticket-features li::before {
          content: '→';
          color: var(--color-brand-green);
          margin-right: 0.75rem;
          font-weight: 900;
        }

        @media (max-width: 600px) {
          .ticket-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
