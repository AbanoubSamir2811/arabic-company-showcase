import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Users, UserCog, Settings, LogOut, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout() {
  const { user, role, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
    { label: 'المنتجات', path: '/dashboard/products', icon: Package, roles: ['admin', 'manager'] },
    { label: 'الموظفين', path: '/dashboard/employees', icon: Users, roles: ['admin'] },
    { label: 'الإعدادات', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
  ].filter((item) => item.roles.includes(role));

  return (
    <div dir="rtl" className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-l hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg text-primary">لوحة التحكم</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {role === 'admin' ? 'مسؤول' : role === 'manager' ? 'مدير' : 'موظف'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link to="/"><Home className="h-4 w-4" /> الموقع الرئيسي</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={signOut}>
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-card border-b p-4 flex items-center justify-between">
          <h2 className="font-bold text-primary">لوحة التحكم</h2>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-card border-b">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground bg-muted'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
