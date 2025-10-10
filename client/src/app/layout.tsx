import './styles/layout.module.css'; 
import styles from './styles/layout.module.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { AuthProvider } from '../context/AuthProvider';


const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'CodeCoach AI',
  description: 'DSA Practice with AI Feedback',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: '#f0f4f8',
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      >
        <AuthProvider>
          <Header />
          <main className={styles.main} style={{ flex: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
