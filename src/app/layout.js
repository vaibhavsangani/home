import './globals.css';
import Helpline from '@/components/Helpline';

export const metadata = {
  title: 'Didaar Exhibition | Premium Event Experience',
  description: 'Join the exclusive Didaar Exhibition. Premium stall booking and visitor registration for India\'s leading fashion and lifestyle event.',
  keywords: 'Didaar Exhibition, Fashion Exhibition, Lifestyle Event, Stall Booking, Event Registration',
  openGraph: {
    title: 'Didaar Exhibition',
    description: 'India\'s Premium Fashion & Lifestyle Exhibition',
    url: 'https://didaar-exhibition.vercel.app',
    siteName: 'Didaar Exhibition',
    images: [
      {
        url: 'https://didaar-exhibition.vercel.app/og-image.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <main className="app-container">
          {children}
        </main>
        <Helpline />
      </body>
    </html>
  );
}
