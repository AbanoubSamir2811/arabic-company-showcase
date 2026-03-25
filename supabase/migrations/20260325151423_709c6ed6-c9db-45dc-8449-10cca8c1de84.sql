
-- Create helper function for checking if user has any role (employee+)
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- Products: allow 'user' role to insert/update (in addition to admin/manager)
DROP POLICY IF EXISTS "Admin/Manager can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin/Manager can update products" ON public.products;
DROP POLICY IF EXISTS "Admin/Manager can delete products" ON public.products;

CREATE POLICY "Staff can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (has_any_role(auth.uid()));

CREATE POLICY "Staff can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (has_any_role(auth.uid()));

CREATE POLICY "Admin/Manager can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (is_admin_or_manager(auth.uid()));

-- Employees: allow manager to manage (in addition to admin)
DROP POLICY IF EXISTS "Admin can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admin can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admin can delete employees" ON public.employees;

CREATE POLICY "Admin/Manager can insert employees" ON public.employees
  FOR INSERT TO authenticated
  WITH CHECK (is_admin_or_manager(auth.uid()));

CREATE POLICY "Admin/Manager can update employees" ON public.employees
  FOR UPDATE TO authenticated
  USING (is_admin_or_manager(auth.uid()));

CREATE POLICY "Admin/Manager can delete employees" ON public.employees
  FOR DELETE TO authenticated
  USING (is_admin_or_manager(auth.uid()));

-- Employees: allow all staff to view (not just authenticated)
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
CREATE POLICY "Staff can view employees" ON public.employees
  FOR SELECT TO authenticated
  USING (has_any_role(auth.uid()));

-- User roles: allow manager to view all roles (needed for users management)
DROP POLICY IF EXISTS "Admin can view all roles" ON public.user_roles;
CREATE POLICY "Admin/Manager can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (is_admin_or_manager(auth.uid()));

-- User roles: allow manager to manage non-admin roles
DROP POLICY IF EXISTS "Admin can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can delete roles" ON public.user_roles;

CREATE POLICY "Admin/Manager can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (is_admin_or_manager(auth.uid()));

CREATE POLICY "Admin/Manager can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (is_admin_or_manager(auth.uid()));

CREATE POLICY "Admin/Manager can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (is_admin_or_manager(auth.uid()));
