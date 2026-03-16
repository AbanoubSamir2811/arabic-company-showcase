import { Target, Eye, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-bl from-primary/10 via-background to-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">من نحن</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            تعرف على قصتنا ورؤيتنا وأهدافنا
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-center mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed">
              تأسس متجرنا بهدف تقديم أفضل المنتجات للعملاء في المنطقة. نحن نؤمن
              بأن كل عميل يستحق الحصول على منتجات عالية الجودة بأسعار عادلة. منذ
              انطلاقتنا ونحن نسعى لتوسيع تشكيلتنا وتحسين خدماتنا لنكون الخيار
              الأول لعملائنا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: 'رؤيتنا',
                desc: 'أن نكون الوجهة الأولى للتسوق الذكي في المنطقة، من خلال تقديم تجربة تسوق فريدة ومنتجات مختارة بعناية.',
              },
              {
                icon: Target,
                title: 'مهمتنا',
                desc: 'توفير منتجات عالية الجودة بأسعار تنافسية مع خدمة عملاء متميزة تلبي احتياجات وتطلعات عملائنا.',
              },
              {
                icon: Award,
                title: 'قيمنا',
                desc: 'الجودة، الأمانة، الابتكار، وخدمة العملاء هي القيم التي نعتز بها ونلتزم بتطبيقها في كل تعاملاتنا.',
              },
              {
                icon: Users,
                title: 'فريقنا',
                desc: 'فريق عمل متخصص ومتحمس يسعى دائمًا لتقديم أفضل الخدمات وتحقيق رضا العملاء.',
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
