import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <>
      <section className="bg-gradient-to-bl from-primary/10 via-background to-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">سلة المشتريات</h1>
          <p className="text-muted-foreground text-lg">
            {items.length > 0 ? `لديك ${items.length} منتج في السلة` : 'السلة فارغة'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">سلة المشتريات فارغة</p>
            <Button asChild>
              <Link to="/products">تصفح المنتجات</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingCart className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.discount_price ? (
                          <>
                            <span className="text-primary font-bold">{item.discount_price.toFixed(2)} ر.س</span>
                            <span className="text-muted-foreground line-through text-sm">{item.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-primary font-bold">{item.price.toFixed(2)} ر.س</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">ملخص الطلب</h3>
                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                        <span>{((item.discount_price ?? item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-primary">{totalPrice.toFixed(2)} ر.س</span>
                  </div>
                  <Button className="w-full" size="lg">
                    إتمام الشراء
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>
                    تفريغ السلة
                  </Button>
                  <Button variant="link" className="w-full" asChild>
                    <Link to="/products">
                      <ArrowRight className="h-4 w-4 ml-1" /> متابعة التسوق
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
