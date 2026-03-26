import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

export default function Products() {
  const { addToCart } = useCart();
  const { isArabic } = useLanguage();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      discount_price: product.discount_price ? Number(product.discount_price) : null,
      image_url: product.image_url,
    });
    toast({
      title: isArabic ? 'تمت الإضافة للسلة' : 'Added to cart',
      description: isArabic ? `تم إضافة ${product.name} إلى السلة` : `${product.name} added to your cart`,
    });
  };

  return (
    <>
      <section className="bg-gradient-to-bl from-primary/10 via-background to-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">{isArabic ? 'منتجاتنا' : 'Our Products'}</h1>
          <p className="text-muted-foreground text-lg">
            {isArabic ? 'اكتشف تشكيلتنا المتنوعة من المنتجات' : 'Discover our wide range of products'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-square" />
                <CardContent className="p-5 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
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
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(product as any).discount_price ? (
                        <>
                          <span className="text-primary font-bold text-lg">{Number((product as any).discount_price).toFixed(2)} ر.س</span>
                          <span className="text-muted-foreground line-through text-sm">{Number((product as any).price).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-primary font-bold text-lg">{Number((product as any).price).toFixed(2)} ر.س</span>
                      )}
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4 ml-1" /> {isArabic ? 'أضف للسلة' : 'Add to cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{isArabic ? 'لا توجد منتجات حالياً' : 'No products available right now'}</p>
          </div>
        )}
      </section>
    </>
  );
}
