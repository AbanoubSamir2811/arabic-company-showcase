import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, ShieldX, UserCog, Users } from 'lucide-react';
import type { AppRole } from '@/hooks/use-auth';

const ROLE_LABELS: Record<string, { label: string; icon: typeof Shield; variant: 'default' | 'secondary' | 'outline' }> = {
  admin: { label: 'مسؤول', icon: ShieldCheck, variant: 'default' },
  manager: { label: 'مدير', icon: Shield, variant: 'secondary' },
  user: { label: 'موظف', icon: UserCog, variant: 'outline' },
};

type UserWithRole = {
  user_id: string;
  display_name: string | null;
  created_at: string;
  role: AppRole | null;
  role_id: string | null;
};

export default function UsersManagement() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('user_id, display_name, created_at')
        .order('created_at', { ascending: false });
      if (pErr) throw pErr;

      // Get all roles
      const { data: roles, error: rErr } = await supabase
        .from('user_roles')
        .select('id, user_id, role');
      if (rErr) throw rErr;

      const roleMap = new Map(roles?.map(r => [r.user_id, r]) ?? []);

      return (profiles ?? []).map(p => ({
        user_id: p.user_id,
        display_name: p.display_name,
        created_at: p.created_at,
        role: (roleMap.get(p.user_id)?.role as AppRole) ?? null,
        role_id: roleMap.get(p.user_id)?.id ?? null,
      })) as UserWithRole[];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole, existingRoleId }: { userId: string; newRole: AppRole | 'none'; existingRoleId: string | null }) => {
      if (newRole === 'none') {
        // Remove role
        if (existingRoleId) {
          const { error } = await supabase.from('user_roles').delete().eq('id', existingRoleId);
          if (error) throw error;
        }
      } else if (existingRoleId) {
        // Update existing role
        const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('id', existingRoleId);
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'تم تحديث الصلاحية بنجاح' });
    },
    onError: (e: Error) => toast({ title: 'خطأ', description: e.message, variant: 'destructive' }),
  });

  const { role: currentRole } = useAuth();

  const handleRoleChange = (user: UserWithRole, value: string) => {
    if (user.user_id === currentUser?.id) {
      toast({ title: 'لا يمكنك تغيير صلاحيتك', variant: 'destructive' });
      return;
    }
    // Managers cannot change admin roles or promote to admin
    if (currentRole === 'manager') {
      if (user.role === 'admin') {
        toast({ title: 'لا يمكنك التحكم في صلاحيات المسؤول', variant: 'destructive' });
        return;
      }
      if (value === 'admin') {
        toast({ title: 'لا يمكنك ترقية مستخدم إلى مسؤول', variant: 'destructive' });
        return;
      }
    }
    updateRoleMutation.mutate({
      userId: user.user_id,
      newRole: value as AppRole | 'none',
      existingRoleId: user.role_id,
    });
  };

  const getRoleBadge = (role: AppRole | null) => {
    if (!role) return <Badge variant="outline" className="text-muted-foreground">زائر</Badge>;
    const info = ROLE_LABELS[role];
    const Icon = info.icon;
    return (
      <Badge variant={info.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {info.label}
      </Badge>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الحسابات والصلاحيات</h1>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جارٍ التحميل...</p>
      ) : users && users.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الصلاحية الحالية</TableHead>
                <TableHead>تغيير الصلاحية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.user_id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{u.display_name || 'بدون اسم'}</span>
                      {u.user_id === currentUser?.id && (
                        <Badge variant="outline" className="mr-2 text-xs">أنت</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(u.created_at).toLocaleDateString('ar-EG')}
                  </TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role ?? 'none'}
                      onValueChange={(val) => handleRoleChange(u, val)}
                      disabled={u.user_id === currentUser?.id || updateRoleMutation.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">زائر</SelectItem>
                        <SelectItem value="user">موظف</SelectItem>
                        <SelectItem value="manager">مدير</SelectItem>
                        <SelectItem value="admin">مسؤول</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>لا يوجد مستخدمين مسجلين بعد.</p>
        </div>
      )}
    </div>
  );
}
