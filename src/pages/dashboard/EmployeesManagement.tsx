import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  position: string;
  phone: string | null;
  image_url: string | null;
};

export default function EmployeesManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: '', position: '', phone: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['admin-employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('*').order('created_at');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || null;
      if (imageFile) {
        image_url = await uploadImage(imageFile, 'employees');
      }

      if (editing) {
        const { error } = await supabase
          .from('employees')
          .update({ name: form.name, position: form.position, phone: form.phone || null, image_url })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employees')
          .insert({ name: form.name, position: form.position, phone: form.phone || null, image_url });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      toast({ title: editing ? 'تم تحديث بيانات الموظف' : 'تم إضافة الموظف' });
      resetForm();
    },
    onError: (e: Error) => toast({ title: 'خطأ', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      toast({ title: 'تم حذف الموظف' });
    },
  });

  const resetForm = () => {
    setForm({ name: '', position: '', phone: '' });
    setImageFile(null);
    setEditing(null);
    setDialogOpen(false);
  };

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({ name: e.name, position: e.position, phone: e.phone ?? '' });
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الموظفين</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 ml-2" /> إضافة موظف</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>الوظيفة</Label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الصورة</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
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
      ) : employees && employees.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>الوظيفة</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={emp.image_url ?? ''} />
                        <AvatarFallback>{emp.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{emp.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.phone ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(emp)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(emp.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>لا يوجد موظفين. أضف أول موظف!</p>
        </div>
      )}
    </div>
  );
}
