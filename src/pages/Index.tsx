import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const { data: settings } = useSiteSettings();
  const { data: products } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order')
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary/10 via-background to-accent/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              مرحباً بكم في{' '}
              <span className="text-primary">{settings?.company_name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {settings?.company_description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/products">تصفح المنتجات</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShoppingBag, title: 'منتجات متنوعة', desc: 'تشكيلة واسعة من أفضل المنتجات' },
            { icon: Star, title: 'جودة عالية', desc: 'نلتزم بأعلى معايير الجودة' },
            { icon: Truck, title: 'توصيل سريع', desc: 'نوصل طلبك بأسرع وقت ممكن' },
          ].map((f, i) => (
            <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About snippet */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">من نحن</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            نحن متجر متخصص في تقديم أفضل المنتجات المختارة بعناية. نسعى لتوفير
            تجربة تسوق مميزة لعملائنا من خلال تقديم منتجات عالية الجودة بأسعار
            تنافسية وخدمة عملاء متميزة.
          </p>
          <Button variant="link" asChild className="mt-4">
            <Link to="/about">
              اعرف المزيد <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      {products && products.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">منتجاتنا المميزة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-square bg-muted overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/products">عرض جميع المنتجات</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
