-- Add price column to products
ALTER TABLE public.products ADD COLUMN price numeric(10,2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN discount_price numeric(10,2) DEFAULT NULL;

-- Create offers table for homepage slider
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  link text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offers viewable by everyone" ON public.offers FOR SELECT TO public USING (true);
CREATE POLICY "Admin can insert offers" ON public.offers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update offers" ON public.offers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete offers" ON public.offers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();