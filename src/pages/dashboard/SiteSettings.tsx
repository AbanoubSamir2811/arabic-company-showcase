import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function SiteSettings() {
  const { data: settings } = useSiteSettings();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    company_name: '',
    company_description: '',
    phone: '',
    whatsapp: '',
    email: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name,
        company_description: settings.company_description,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        facebook: settings.facebook,
        instagram: settings.instagram,
        twitter: settings.twitter,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(form)) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value })
          .eq('key', key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'تم حفظ الإعدادات بنجاح' });
    },
    onError: (e: Error) => toast({ title: 'خطأ', description: e.message, variant: 'destructive' }),
  });

  const fields = [
    { key: 'company_name', label: 'اسم الشركة' },
    { key: 'company_description', label: 'وصف الشركة' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'whatsapp', label: 'رقم الواتساب' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'facebook', label: 'رابط فيسبوك' },
    { key: 'instagram', label: 'رابط إنستجرام' },
    { key: 'twitter', label: 'رابط تويتر' },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إعدادات الموقع</h1>
      <Card>
        <CardHeader>
          <CardTitle>معلومات الموقع</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
            className="space-y-4 max-w-lg"
          >
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}</Label>
                <Input
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
