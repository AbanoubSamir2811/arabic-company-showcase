import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useLanguage } from '@/hooks/use-language';

export default function PublicLayout() {
  const { isArabic } = useLanguage();

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
