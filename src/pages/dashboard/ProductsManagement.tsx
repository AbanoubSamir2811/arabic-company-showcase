import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ShoppingBag } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  price: number;
  discount_price: number | null;
};

export default function ProductsManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', is_featured: false, sort_order: 0, price: 0, discount_price: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('sort_order');
      if (error) throw error;
      return data as unknown as Product[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || null;
      if (imageFile) {
        image_url = await uploadImage(imageFile, 'products');
      }

      const payload = {
        name: form.name,
        description: form.description,
        image_url,
        is_featured: form.is_featured,
        sort_order: form.sort_order,
        price: form.price,
        discount_price: form.discount_price ? Number(form.discount_price) : null,
      };

      if (editing) {
        const { error } = await supabase.from('products').update(payload as any).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: editing ? 'تم تحديث المنتج' : 'تم إضافة المنتج' });
      resetForm();
    },
    onError: (e: Error) => toast({ title: 'خطأ', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'تم حذف المنتج' });
    },
  });

  const resetForm = () => {
    setForm({ name: '', description: '', is_featured: false, sort_order: 0, price: 0, discount_price: '' });
    setImageFile(null);
    setEditing(null);
    setDialogOpen(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      price: p.price,
      discount_price: p.discount_price ? String(p.discount_price) : '',
    });
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 ml-2" /> إضافة منتج</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>اسم المنتج</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>سعر العرض (اختياري)</Label>
                  <Input type="number" step="0.01" min="0" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} placeholder="اتركه فارغ" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>صورة المنتج</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="space-y-2">
                <Label>ترتيب العرض</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.is_featured}
                  onCheckedChange={(c) => setForm({ ...form, is_featured: !!c })}
                />
                <Label>منتج مميز (يظهر في الصفحة الرئيسية)</Label>
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جارٍ التحميل...</p>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {p.discount_price ? (
                    <>
                      <span className="text-primary font-bold">{p.discount_price.toFixed(2)} ر.س</span>
                      <span className="text-muted-foreground line-through text-sm">{p.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-primary font-bold">{p.price.toFixed(2)} ر.س</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                {p.is_featured && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">مميز</span>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                    <Pencil className="h-3.5 w-3.5 ml-1" /> تعديل
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="h-3.5 w-3.5 ml-1" /> حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>لا توجد منتجات. أضف منتجك الأول!</p>
        </div>
      )}
    </div>
  );
}
