import { Target, Eye, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function About() {
  const { isArabic } = useLanguage();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-bl from-primary/10 via-background to-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">{isArabic ? 'من نحن' : 'About Us'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isArabic ? 'تعرف على قصتنا ورؤيتنا وأهدافنا' : 'Learn about our story, vision, and goals'}
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-center mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isArabic
                ? 'تأسس متجرنا بهدف تقديم أفضل المنتجات للعملاء في المنطقة. نحن نؤمن بأن كل عميل يستحق الحصول على منتجات عالية الجودة بأسعار عادلة. منذ انطلاقتنا ونحن نسعى لتوسيع تشكيلتنا وتحسين خدماتنا لنكون الخيار الأول لعملائنا.'
                : 'Our store was founded to deliver the best products in the region. We believe every customer deserves high-quality products at fair prices. Since day one, we have kept improving our catalog and services to be our customers’ first choice.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: isArabic ? 'رؤيتنا' : 'Our Vision',
                desc: isArabic
                  ? 'أن نكون الوجهة الأولى للتسوق الذكي في المنطقة، من خلال تقديم تجربة تسوق فريدة ومنتجات مختارة بعناية.'
                  : 'To be the top destination for smart shopping in the region through a unique experience and carefully selected products.',
              },
              {
                icon: Target,
                title: isArabic ? 'مهمتنا' : 'Our Mission',
                desc: isArabic
                  ? 'توفير منتجات عالية الجودة بأسعار تنافسية مع خدمة عملاء متميزة تلبي احتياجات وتطلعات عملائنا.'
                  : 'Provide high-quality products at competitive prices with customer support that meets expectations.',
              },
              {
                icon: Award,
                title: isArabic ? 'قيمنا' : 'Our Values',
                desc: isArabic
                  ? 'الجودة، الأمانة، الابتكار، وخدمة العملاء هي القيم التي نعتز بها ونلتزم بتطبيقها في كل تعاملاتنا.'
                  : 'Quality, integrity, innovation, and customer care are the values we practice in every interaction.',
              },
              {
                icon: Users,
                title: isArabic ? 'فريقنا' : 'Our Team',
                desc: isArabic
                  ? 'فريق عمل متخصص ومتحمس يسعى دائمًا لتقديم أفضل الخدمات وتحقيق رضا العملاء.'
                  : 'A dedicated and passionate team always working to provide the best service and customer satisfaction.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
