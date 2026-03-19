import './globals.css';
import Helpline from '@/components/Helpline';

export const metadata = {
  title: 'Didaar Exhibition',
  description: 'Premium event registration for the exclusive Didaar Exhibition.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="app-container">
          {children}
        </main>
        <Helpline />
      </body>
    </html>
  );
}
