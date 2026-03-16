import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users } from 'lucide-react';

export default function DashboardHome() {
  const { data: productsCount } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: employeesCount } = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مرحباً بك في لوحة التحكم</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المنتجات</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productsCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الموظفين</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{employeesCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
