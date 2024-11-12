import { Inter } from 'next/font/google';
import '../styles/globals.css';

import Footer from '../components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'brokr',
  description: 'Brokr',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>brokr</title>
        <link rel="icon" href="/assets/favicon.png" type="image/png" />

      </head>
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
