import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  ar: {
    home: 'الرئيسية',
    about: 'من نحن',
    products: 'المنتجات',
    contact: 'تواصل معنا',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل خروج',
    login: 'تسجيل دخول',
    cart: 'السلة',
    companyFallback: 'متجرنا',
    language: 'EN',
  },
  en: {
    home: 'Home',
    about: 'About',
    products: 'Products',
    contact: 'Contact',
    dashboard: 'Dashboard',
    logout: 'Logout',
    login: 'Login',
    cart: 'Cart',
    companyFallback: 'Our Store',
    language: 'AR',
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { totalItems } = useCart();
  const { user, role, signOut } = useAuth();
  const { language, isArabic, toggleLanguage } = useLanguage();

  const t = labels[language];
  const canAccessDashboard = role === 'admin' || role === 'manager';
  const showLogoutInsteadOfDashboard = !!user && !canAccessDashboard;

  const navItems = [
    { label: t.home, path: '/' },
    { label: t.about, path: '/about' },
    { label: t.products, path: '/products' },
    { label: t.contact, path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-3 sm:px-4 gap-2">
        <Link to="/" className="text-lg sm:text-xl font-bold text-primary truncate max-w-[45vw]">
          {settings?.company_name ?? t.companyFallback}
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {canAccessDashboard ? (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/dashboard')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {t.dashboard}
            </Link>
          ) : showLogoutInsteadOfDashboard ? (
            <Button variant="ghost" className="text-sm font-medium" onClick={handleSignOut}>
              {t.logout}
            </Button>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/login'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {t.login}
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={toggleLanguage}>
            {t.language}
          </Button>
          <Link to="/cart" className="relative mr-2">
            <Button variant="ghost" size="icon" aria-label={t.cart}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={toggleLanguage}>
            {t.language}
          </Button>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label={t.cart}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t bg-card pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-accent text-primary'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {canAccessDashboard ? (
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/dashboard')
                  ? 'bg-accent text-primary'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {t.dashboard}
            </Link>
          ) : showLogoutInsteadOfDashboard ? (
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none px-6 py-3 text-sm font-medium"
              onClick={handleSignOut}
            >
              {t.logout}
            </Button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === '/login'
                  ? 'bg-accent text-primary'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {t.login}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
