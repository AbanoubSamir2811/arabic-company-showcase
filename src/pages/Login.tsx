import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { isArabic } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: isArabic ? 'خطأ في تسجيل الدخول' : 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-primary/10 via-background to-accent/20 px-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isArabic ? 'تسجيل الدخول' : 'Login'}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {isArabic ? 'ادخل بيانات حسابك للوصول إلى لوحة التحكم' : 'Enter your account details to access the dashboard'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{isArabic ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{isArabic ? 'كلمة المرور' : 'Password'}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isArabic ? 'جارٍ تسجيل الدخول...' : 'Logging in...') : isArabic ? 'تسجيل الدخول' : 'Login'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {isArabic ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link to="/signup" className="text-primary hover:underline">
                {isArabic ? 'إنشاء حساب جديد' : 'Create new account'}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
