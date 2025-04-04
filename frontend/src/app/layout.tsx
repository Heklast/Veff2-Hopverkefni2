// src/app/layout.tsx
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

//þetta er sameiginlegt með öllum síðum, header og fótur fastur
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}