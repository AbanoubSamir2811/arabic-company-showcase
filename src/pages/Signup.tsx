import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isArabic } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    setLoading(false);
    if (error) {
      toast({ title: isArabic ? 'خطأ في إنشاء الحساب' : 'Signup failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isArabic ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully' });
      navigate('/login');
    }
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-primary/10 via-background to-accent/20 px-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {isArabic ? 'أدخل بياناتك لإنشاء حساب جديد' : 'Enter your details to create a new account'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{isArabic ? 'الاسم' : 'Name'}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{isArabic ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{isArabic ? 'كلمة المرور' : 'Password'}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isArabic ? 'جارٍ إنشاء الحساب...' : 'Creating account...') : isArabic ? 'إنشاء حساب' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
