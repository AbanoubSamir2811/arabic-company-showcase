import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useLanguage } from '@/hooks/use-language';

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">{settings?.company_name}</h3>
            <p className="text-sm opacity-80">{settings?.company_description}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">{isArabic ? 'تواصل معنا' : 'Contact Us'}</h3>
            <div className="space-y-2 text-sm">
              <a href={`tel:${settings?.phone}`} className="flex items-center gap-2 hover:opacity-80">
                <Phone className="h-4 w-4" /> {settings?.phone}
              </a>
              <a href={`mailto:${settings?.email}`} className="flex items-center gap-2 hover:opacity-80">
                <Mail className="h-4 w-4" /> {settings?.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">{isArabic ? 'تابعنا' : 'Follow Us'}</h3>
            <div className="flex gap-3">
              <a href={settings?.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={settings?.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={settings?.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-70">
          {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'} © {new Date().getFullYear()} {settings?.company_name}
        </div>
      </div>
    </footer>
  );
}
