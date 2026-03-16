import { Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '')}`;

  return (
    <>
      <section className="bg-gradient-to-bl from-primary/10 via-background to-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">تواصل معنا</h1>
          <p className="text-muted-foreground text-lg">نسعد بتواصلكم معنا في أي وقت</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-2">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">اتصل بنا</h3>
                <a href={`tel:${settings?.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {settings?.phone}
                </a>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-2">
                <MessageCircle className="h-10 w-10 text-[#25D366] mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">واتساب</h3>
                <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a]">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    تواصل عبر واتساب
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-2">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                <a href={`mailto:${settings?.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {settings?.email}
                </a>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-2">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">موقعنا</h3>
                <p className="text-muted-foreground">المملكة العربية السعودية</p>
              </CardContent>
            </Card>
          </div>

          {/* Social */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">تابعنا على وسائل التواصل</h2>
            <div className="flex justify-center gap-4">
              {[
                { icon: Facebook, url: settings?.facebook, label: 'فيسبوك', color: 'hover:text-[#1877F2]' },
                { icon: Instagram, url: settings?.instagram, label: 'إنستجرام', color: 'hover:text-[#E4405F]' },
                { icon: Twitter, url: settings?.twitter, label: 'تويتر', color: 'hover:text-[#1DA1F2]' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`p-4 rounded-full bg-muted text-foreground transition-colors ${s.color}`}
                >
                  <s.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
